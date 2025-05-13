const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // <-- ADD THIS
const authRoutes = require('./src/routes/authRoute');
const taskRoutes = require('./src/routes/taskRoutes');

// Initialize app
const app = express();
dotenv.config();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
 // <-- ENABLE CORS for all origins
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
