const express = require('express');
const mongoose = require('mongoose');
const upload = require('../middlewares/upload');
const Event = require('../models/Event');
const EventSignup = require('../models/EventSignup');
const EventFile = require('../models/EventFile');
const User = require('../models/User');
const Logistics = require('../models/Logistics');
const Task = require('../models/Task');
const {
  createEvent,
  getAllEvents,
  getEventsByUser,
  createSignup
} = require('../controllers/eventController');

const router = express.Router();

router.post('/', upload.single('file'), createEvent);
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.status(200).json({ success: true, data: events });
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch events' });
  }
});
router.get('/user/:userId', getEventsByUser);
router.get('/created/:userId', async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ success: false, error: 'Invalid user ID format' });
  }

  try {
    const events = await Event.find({ organizer: userId });
    res.status(200).json({
      success: true,
      data: events,
      message: events.length ? 'Events fetched successfully' : 'No events found for this user',
    });
  } catch (err) {
    console.error('Error fetching created events:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch created events' });
  }
});
router.get('/:eventId/participants', async (req, res) => {
  const { eventId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ success: false, error: 'Invalid event ID format' });
  }
  try {
    const signups = await EventSignup.find({ eventId }).populate('userId', 'name email');

    const participants = signups
      .map(s => s.userId)
      .filter(u => u && u.name); 

    res.status(200).json({ success: true, data: participants });
  } catch (err) {
    console.error('Participant fetch error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch participants' });
  }
});
router.get('/:eventId', async (req, res) => {
  const { eventId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ success: false, error: 'Invalid event ID format' });
  }
  try {
    const event = await Event.findById(eventId).populate('organizer', '_id name email');

    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    res.status(200).json({ success: true, data: event });
  } catch (err) {
    console.error('Error fetching event:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch event' });
  }
});
router.get('/:eventId/files', async (req, res) => {
  try {
    const files = await EventFile.find({ eventId: req.params.eventId });
    res.status(200).json({ success: true, data: files });
  } catch (err) {
    console.error('File fetch error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch files' });
  }
});
router.post('/events/:eventId/upload', upload.single('file'), async (req, res) => {
  const { eventId } = req.params;
  const { originalname, path } = req.file;

  const fileRecord = new EventFile({
    eventId,
    file_name: originalname,
    file_url: `/uploads/${path}`, 
  });
  await fileRecord.save();
  res.json({ success: true, data: fileRecord });
});
router.get('/volunteers', async (req, res) => {
  try {
    const volunteers = await User.find({ role: 'volunteer' });
    res.json({ volunteers });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch volunteers' });
  }
});
router.patch('/volunteers/:id/checkin', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid volunteer ID format' });
  }
  try {
    const updated = await User.findByIdAndUpdate(
      id,
      { checkedIn: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Volunteer not found' });
    }
    res.status(200).json(updated);
  } catch (err) {
    console.error('Check-in error:', err);
    res.status(500).json({ error: 'Failed to check in volunteer' });
  }
});
router.put('/:eventId', async (req, res) => {
  const { eventId } = req.params;
  const updates = req.body;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ success: false, error: 'Invalid event ID format' });
  }

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    const incomingOrganizer = req.body.organizer;
    const actualOrganizer = event.organizer?.toString();

    if (!incomingOrganizer) {
      return res.status(400).json({ success: false, error: 'Organizer ID is required' });
    }

    if (incomingOrganizer !== actualOrganizer) {
      return res.status(403).json({ success: false, error: 'You can only modify your own events' });
    }

    Object.assign(event, updates);
    await event.save();

    res.status(200).json({ success: true, data: event, message: 'Event updated successfully' });
  } catch (err) {
    console.error('Event update error:', err);
    res.status(500).json({ success: false, error: 'Failed to update event' });
  }
});

router.delete('/:eventId', async (req, res) => {
  const { eventId } = req.params;
  const { organizer } = req.body;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ success: false, error: 'Invalid event ID format' });
  }

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    const actualOrganizer = event.organizer?.toString();

    if (!organizer) {
      return res.status(400).json({ success: false, error: 'Organizer ID is required' });
    }

    if (organizer !== actualOrganizer) {
      return res.status(403).json({ success: false, error: 'You can only delete your own events' });
    }

    await Event.findByIdAndDelete(eventId);
    await EventSignup.deleteMany({ eventId });
    await EventFile.deleteMany({ eventId });

    res.status(200).json({ success: true, message: 'Event and related data deleted successfully' });
  } catch (err) {
    console.error('Event deletion error:', err);
    res.status(500).json({ success: false, error: 'Failed to delete event' });
  }
});

router.post('/:eventId/signups', async (req, res) => {
  const { eventId } = req.params;
  const { userId } = req.body;

  try {
    const existing = await EventSignup.findOne({ eventId, userId });
    if (existing) {
      return res.status(400).json({ success: false, error: 'Already signed up' });
    }

    const signup = new EventSignup({ eventId, userId, status: 'signed-up' });
    await signup.save();

    res.status(201).json({ success: true, data: signup });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ success: false, error: 'Signup failed' });
  }
});
router.get('/:eventId/logistics', async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ error: 'Invalid event ID format' });
    }

    const logistics = await Logistics.find({ eventId });

    res.status(200).json(logistics);
  } catch (err) {
    console.error('Error fetching logistics:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.post('/:eventId/logistics', async (req, res) => {
  const { eventId } = req.params;
  const { name, status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ error: 'Invalid event ID format' });
  }

  if (!name) {
    return res.status(400).json({ error: 'Task name is required' });
  }

  try {
    const task = new Logistics({ eventId, name, status });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error('Error creating logistics task:', err);
    res.status(500).json({ error: 'Failed to create task' });
  }
});



router.put('/:eventId/logistics/:taskId', async (req, res) => {
  const { eventId, taskId } = req.params;
  const { name, status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return res.status(400).json({ error: 'Invalid task ID format' });
  }

  try {
    const updated = await Logistics.findOneAndUpdate(
      { _id: taskId, eventId },
      { name, status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});


router.delete('/:eventId/logistics/:taskId', async (req, res) => {
  const { eventId, taskId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return res.status(400).json({ error: 'Invalid task ID format' });
  }

  try {
    const deleted = await Logistics.findOneAndDelete({ _id: taskId, eventId });

    if (!deleted) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});


router.post('/:eventId/logistics', async (req, res) => {
  const { eventId } = req.params;
  const { name, status, assignedTo } = req.body;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ error: 'Invalid event ID format' });
  }

  if (!name) {
    return res.status(400).json({ error: 'Task name is required' });
  }

  try {
    const logistics = new Logistics({ eventId, name, status, assignedTo });
    await logistics.save();

    if (assignedTo) {
      const task = new Task({
        title: name,
        status,
        assignedTo,
        eventId,
        createdAt: new Date(),
      });
      await task.save();
    }

    res.status(201).json(logistics);
  } catch (err) {
    console.error('Error creating logistics task:', err);
    res.status(500).json({ error: 'Failed to create task' });
  }
});


router.put('/:eventId/logistics/:taskId/assign', async (req, res) => {
  const { eventId, taskId } = req.params;
  const { assignedTo } = req.body;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return res.status(400).json({ error: 'Invalid task ID format' });
  }

  if (!assignedTo || !mongoose.Types.ObjectId.isValid(assignedTo)) {
    return res.status(400).json({ error: 'Invalid or missing volunteer ID' });
  }

  try {
    const updated = await Logistics.findOneAndUpdate(
      { _id: taskId, eventId },
      { assignedTo },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Logistics task not found' });
    }

    
    const existingTask = await Task.findOne({ eventId, title: updated.name });
    if (!existingTask) {
      await new Task({
        title: updated.name,
        status: updated.status,
        assignedTo,
        eventId,
      }).save();
    } else {
      existingTask.assignedTo = assignedTo;
      await existingTask.save();
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error('Assignment error:', err);
    res.status(500).json({ error: 'Failed to assign volunteer' });
  }
});




router.get('/volunteers/event/:eventId', async (req, res) => {
  const { eventId } = req.params;
  console.log('Fetching volunteers for event:', eventId);

  try {
    const signups = await EventSignup.find({ eventId }).populate('userId', 'name role');
    console.log('Signups found:', signups);

    const volunteers = signups
      .map((s) => s.userId)
      .filter((u) => u && u.role === 'volunteer');

    console.log('Filtered volunteers:', volunteers);
    res.json({ volunteers });
  } catch (err) {
    console.error('Error fetching event volunteers:', err);
    res.status(500).json({ error: 'Failed to fetch event volunteers' });
  }
});


module.exports = router;
