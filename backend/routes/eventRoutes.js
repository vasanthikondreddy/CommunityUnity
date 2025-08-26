const express = require('express');
const mongoose = require('mongoose');
const upload = require('../middlewares/upload');
const Event = require('../models/Event');
const EventSignup = require('../models/EventSignup');
const EventFile = require('../models/EventFile');
const {
  createEvent,
  getAllEvents,
  getEventsByUser,
  createSignup
} = require('../controllers/eventController');

const router = express.Router();


router.post('/events', upload.single('file'), createEvent);


router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.status(200).json({ success: true, data: events });
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch events' });
  }
});


router.get('/:eventId/participants', async (req, res) => {
  const { eventId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ success: false, error: 'Invalid event ID format' });
  }

  try {
    const signups = await EventSignup.find({ eventId }).populate('userId', 'name email');
    const participants = signups.map(s => s.userId);
    res.status(200).json({ success: true, data: participants });
  } catch (err) {
    console.error('Participant fetch error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch participants' });
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

// ✅ Get single event by ID
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

// ✅ Get files for an event
router.get('/:eventId/files', async (req, res) => {
  try {
    const files = await EventFile.find({ eventId: req.params.eventId });
    res.status(200).json({ success: true, data: files });
  } catch (err) {
    console.error('File fetch error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch files' });
  }
});

// ✅ Update an event
router.put('/:eventId', async (req, res) => {
  const { eventId } = req.params;
  const updates = req.body;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ success: false, error: 'Invalid event ID format' });
  }

  try {
    const updatedEvent = await Event.findByIdAndUpdate(eventId, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedEvent) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    res.status(200).json({ success: true, data: updatedEvent, message: 'Event updated successfully' });
  } catch (err) {
    console.error('Event update error:', err);
    res.status(500).json({ success: false, error: 'Failed to update event' });
  }
});

// ✅ Delete an event
router.delete('/:eventId', async (req, res) => {
  const { eventId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ success: false, error: 'Invalid event ID format' });
  }

  try {
    const deletedEvent = await Event.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    await EventSignup.deleteMany({ eventId });
    await EventFile.deleteMany({ eventId });

    res.status(200).json({ success: true, message: 'Event and related data deleted successfully' });
  } catch (err) {
    console.error('Event deletion error:', err);
    res.status(500).json({ success: false, error: 'Failed to delete event' });
  }
});

// ✅ Sign up for an event
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

module.exports = router;
