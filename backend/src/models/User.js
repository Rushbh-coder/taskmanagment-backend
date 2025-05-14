const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Notification Preferences Schema
const notificationPrefsSchema = new mongoose.Schema({
  email: { type: Boolean, default: true },
  inApp: { type: Boolean, default: true },
  mute: { type: Boolean, default: false },
}, { _id: false });

// User Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'manager', 'user'],
      default: 'user',
    },
    notificationPrefs: {
      type: notificationPrefsSchema,
      default: () => ({}),
    },
  },
  { timestamps: true }
);

// Password hashing before saving user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to check password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
