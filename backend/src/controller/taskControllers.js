const Task = require('../models/Task');
const User = require('../models/User');

exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, status, assignedTo } = req.body;

    let assignedUser = null;
    let assignedToField = undefined;

    if (assignedTo) {
      assignedUser = await User.findById(assignedTo);
      if (!assignedUser) {
        return res.status(404).json({ error: 'Assigned user not found' });
      }

      // Correct assignment here
      assignedToField = {
        id: assignedUser._id,
        name: assignedUser.name
      };
    }

    const task = new Task({
      title,
      description,
      dueDate,
      priority,
      status,
      createdBy: req.user.id,
      assignedTo: assignedToField
    });

    await task.save();
    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};




// Get all tasks (created by or assigned to the user)
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [
        { createdBy: req.user.id },
        { assignedTo: req.user.id }
      ]
    }).populate('assignedTo', 'name email');

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

// Get a single task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignedTo createdBy', 'name email');
    if (!task) return res.status(404).json({ error: 'Task not found' });

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch task' });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const updates = req.body;

    // Handle assignedTo separately
    if (updates.assignedTo) {
      const user = await User.findById(updates.assignedTo);
      if (!user) return res.status(404).json({ error: 'Assigned user not found' });

      updates.assignedTo = {
        id: user._id,
        name: user.name
      };
    } else {
      updates.assignedTo = null;
    }

    const task = await Task.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!task) return res.status(404).json({ error: 'Task not found' });

    res.status(200).json({ message: 'Task updated successfully', task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
};
