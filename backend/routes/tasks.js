
const express = require('express');
const router = express.Router();

const Task = require('../models/Task');


router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedTo', 'name _id');
    res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

router.put('/:id/status', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    task.status = req.body.status;
    await task.save();

    res.json({ message: 'Task status updated', task });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update task status' });
  }
});

module.exports = router;
