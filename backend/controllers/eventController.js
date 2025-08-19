const Event = require('../models/Event');
const createEvent = async (req, res) => {
  try {
    const { name, description, date, location, organizer } = req.body;
    const event = await Event.create({ name, description, date, location, organizer });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getEventsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const events = await Event.find({ organizer: userId });
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const createSignup = async (req, res) => {
  try {
    const { userId } = req.body;
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    if (!event.signups.includes(userId)) {
      event.signups.push(userId);
      await event.save();
    }

    res.status(200).json({ message: 'Signed up successfully', event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventsByUser,
  createSignup
};
