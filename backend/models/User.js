const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    default: 50 // Match "50 ★" from TaskPlanet UI screenshot as signup reward!
  },
  balance: {
    type: Number,
    default: 0.00 // Match "₹0.00" from TaskPlanet UI screenshot
  },
  avatar: {
    type: String,
    default: '' // Can store a custom URL or base64. If empty, client will render circular initials.
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);
