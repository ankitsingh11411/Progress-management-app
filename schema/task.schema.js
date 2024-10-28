const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { User } = require('../schema/user.schema.js');

const taskSchema = new Schema({
  taskname: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    required: true,
    enum: ['HIGH PRIORITY', 'MEDIUM PRIORITY', 'LOW PRIORITY'],
  },
  checklists: {
    type: [Array],
    required: true,
  },
  creator: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Task = mongoose.model('Task', taskSchema);

module.exports = {
  Task,
};
