const express = require('express');
const router = express.Router();
const authController = require('../controller/authControllers');

// Register Route
router.post('/register', authController.register);

// Login Route
router.post('/login', authController.login);

router.get('/', authController.getAllUsers);
module.exports = router;
