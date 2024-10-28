const express = require('express');
const router = express.Router();
const { Task } = require('../schema/task.schema.js');
const authmiddleware = require('../middleware/auth.js');

router.post('/create', authmiddleware, async (req, res) => {
  try {
    const { taskname, priority, checklists } = req.body;
    const { user } = req;
    const tasks = checklists.split(',').map((task) => task.trim());
    const task = new Task({
      taskname,
      priority,
      checklists: tasks,
      creator: user,
    });
    await task.save();
    res.status(201).json({ message: 'Task created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create task' });
  }
});

router.get('/', authmiddleware, async (req, res) => {
  try {
    const { user } = req;
    const tasks = await Task.find({ creator: user }).select(' -_id');
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get tasks' });
  }
});

module.exports = router;
