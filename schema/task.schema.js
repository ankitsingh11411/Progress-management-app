const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    type: [String],
    required: true,
    validate: {
      validator: function (value) {
        return value && value.length > 0;
      },
      message: 'At least one checklist item is required',
    },
  },
});

const Task = mongoose.model('Task', taskSchema);

module.exports = {
  Task,
};
