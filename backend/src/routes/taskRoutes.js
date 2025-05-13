// routes/task.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const taskController = require('../controller/taskControllers');
const authMiddleware = require('../middleware/authMiddleware');



// All routes are protected by auth middleware
router.post('/', auth, taskController.createTask);
router.get('/', auth, taskController.getTasks);
//router.get('/', auth, taskController.getTasks);
router.get('/:id', auth, taskController.getTaskById);
router.put('/:id', auth, taskController.updateTask);
router.delete('/:id', auth, taskController.deleteTask);

module.exports = router;
