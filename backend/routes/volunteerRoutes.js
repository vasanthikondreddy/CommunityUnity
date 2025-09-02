const express = require('express');
const router = express.Router();
const User = require('../models/User');


router.get('/', async (req, res) => {
  try {
    const volunteers = await User.find({
      role: { $regex: '^volunteer$', $options: 'i' }
    });
    res.json(volunteers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch volunteers' });
  }
});


router.patch('/:id/checkin', async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      {
        checkedIn: true,
        checkInTime: new Date()
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Volunteer not found' });
    }

    res.json(updated);
  } catch (err) {
    console.error('Check-in error:', err);
    res.status(500).json({ error: 'Failed to check in volunteer' });
  }
});

router.patch('/:id/checkout', async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      {
        checkedIn: false,
        checkInTime: null,
      },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Check-out failed' });
  }
});

module.exports = router;
