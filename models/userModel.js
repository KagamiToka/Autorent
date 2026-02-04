const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: [true, 'Username là bắt buộc'],
    unique: true,
    trim: true,
    minlength: [3, 'Username phải có ít nhất 3 ký tự'] 
  },
  password: { 
    type: String, 
    required: [true, 'Password là bắt buộc'] 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);