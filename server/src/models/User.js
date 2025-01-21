// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: function() {
      return !this.firebaseUid;
    }
  },
  firebaseUid: {
    type: String,
    sparse: true
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  registrationDate: {
    type: String,
    default: () => new Date().toISOString().replace('T', ' ').slice(0, 19)
  },
  lastLogin: {
    type: String,
    default: () => new Date().toISOString().replace('T', ' ').slice(0, 19)
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);