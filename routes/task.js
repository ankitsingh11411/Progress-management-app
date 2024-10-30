const express = require('express');
const router = express.Router();
const { Task } = require('../schema/task.schema.js');
const authmiddleware = require('../middleware/auth.js');
const isAuth = require('../utils/index.js');
const { z } = require('zod');
const { validateRequest } = require('zod-express-middleware');

router.post('/', authmiddleware, async (req, res) => {
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

router.get('/', async (req, res) => {
  const userId = await isAuth(req);
  if (!userId) {
    return res.status(401).json({ message: 'User needs to be logged in' });
  }
  try {
    const tasks = await Task.find({ creator: userId });
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
});

router.get(
  '/:id',
  validateRequest({
    params: z.object({
      id: z.string(),
    }),
  }),
  authmiddleware,
  async (req, res) => {
    const { id } = req.params;
    const { user } = req;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    if (task.creator.toString() !== user) {
      return res
        .status(403)
        .json({ message: 'User is not authorized to view this task' });
    }
    res.status(200).json(task);
  }
);

router.delete('/:id', authmiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    if (task.creator.toString() !== user) {
      return res.status(401).json({ message: 'User is not authorized' });
    }
    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete task' });
  }
});

router.put('/:id', authmiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;
    const { taskname, priority, checklists } = req.body;
    const tasks = checklists.split(',').map((task) => task.trim());
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    if (task.creator.toString() !== user) {
      return res
        .status(401)
        .json({ message: 'User is not authorized to update this task' });
    }
    task.taskname = taskname;
    task.priority = priority;
    task.checklists = tasks;
    await task.save();
    res.status(200).json({ message: 'Task updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task' });
  }
});

router.get('/search/:taskname', authmiddleware, async (req, res) => {
  const { taskname } = req.params;
  const { user } = req;

  try {
    const tasks = await Task.find({
      creator: user,
      taskname: { $regex: taskname, $options: 'i' },
    });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
});

module.exports = router;
