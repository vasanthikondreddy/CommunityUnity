const express = require('express');
const upload = require('../middlewares/upload');
const mongoose = require('mongoose');
const Event = require('../models/Event');
// const EventFile = require('../models/EventFile');
const {
  createEvent,
  getAllEvents,
  getEventsByUser,
  createSignup
} = require('../controllers/eventController');

const router = express.Router();

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

router.post('/:eventId/files', upload.single('file'), async (req, res) => {
  try {
    const { eventId } = req.params;
    const file = req.file;

    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const eventFile = new EventFile({
      eventId,
      file_name: file.originalname,
      file_url: `/uploads/${file.filename}` // or Cloudinary URL
    });

    await eventFile.save();
    res.status(201).json(eventFile);
  } catch (err) {
    console.error('File upload error:', err);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

module.exports = router;
