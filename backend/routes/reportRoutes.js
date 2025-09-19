const express = require('express');
const router = express.Router();


// Create a new report
router.post('/reports', async (req, res) => {
  try {
    const report = new Report(req.body);
    await report.save();
    res.status(201).json({ success: true, data: report });
  } catch (err) {
    console.error('Report creation error:', err);
    res.status(500).json({ success: false, error: 'Failed to create report' });
  }
});

// Get all reports
router.get('/reports', async (req, res) => {
  try {
    const reports = await Report.find();
    res.status(200).json({ success: true, data: reports });
  } catch (err) {
    console.error('Fetching reports failed:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch reports' });
  }
});

module.exports = router;
