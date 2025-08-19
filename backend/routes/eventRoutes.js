const express = require('express');
const mongoose = require('mongoose');
const Event = require('../models/Event');
const router = express.Router();
const {
  createEvent,
  getAllEvents,
  getEventsByUser,
  createSignup
} = require('../controllers/eventController');

router.post('/', createEvent); 
router.get('/', getAllEvents); 
router.get('/user/:userId', getEventsByUser); 
router.post('/:eventId/signups', createSignup); 
router.get('/created/:userId', async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID format' });
  }

  try {
    const events = await Event.find({ organizer: userId });

    if (events.length === 0) {
      return res.status(200).json({ message: 'No events found for this user', events: [] });
    }

    res.status(200).json(events);
  } catch (err) {
    console.error('Error fetching created events:', err);
    res.status(500).json({ error: 'Failed to fetch created events' });
  }
});


module.exports = router;
