const express = require('express');
const router = express.Router();
const {
  createAnnouncement,
  getAnnouncements,
} = require('../controllers/announcementController');

// POST new announcement
router.post('/', createAnnouncement);

// GET all announcements
router.get('/', getAnnouncements);

module.exports = router;
