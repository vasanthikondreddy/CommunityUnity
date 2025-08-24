const Event = require('../models/Event');
const { getIO } = require('../socket');

const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, organizer } = req.body;

    if (!title || !description || !date || !location || !organizer) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const fileData = req.file
      ? {
          file_name: req.file.originalname,
          file_url: `/uploads/${req.file.filename}`,
        }
      : null;

    const event = new Event({
      title,
      description,
      date,
      location,
      organizer,
      ...(fileData && { file: fileData }),
    });

    await event.save();

    res.status(201).json({
      success: true,
      data: event,
      message: 'Event created successfully',
    });

    
    const io = getIO();
    io.emit('newEvent', event);
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.status(200).json({ success: true, data: events });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getEventsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const events = await Event.find({ organizer: userId });
    res.status(200).json({ success: true, data: events });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const createSignup = async (req, res) => {
  try {
    const { userId } = req.body;
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ success: false, error: 'Event not found' });

    if (!event.signups.includes(userId)) {
      event.signups.push(userId);
      await event.save();
    }

    res.status(200).json({
      success: true,
      message: 'Signed up successfully',
      data: event,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventsByUser,
  createSignup,
};
