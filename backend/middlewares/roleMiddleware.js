const Event = require('../models/Event');

exports.verifyOrganizer = async (req, res, next) => {
  const eventId = req.params.eventId;

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.organizer.toString() !== req.user._id) {
      return res.status(403).json({ message: 'Access denied: not the organizer' });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: 'Authorization error', error: err.message });
  }
};

