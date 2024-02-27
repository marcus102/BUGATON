const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  accountId: {
    type: String,
    required: true,
    unique: true
  },
  ranking: {
    type: String,
    enum: ['novice', 'intermediate', 'advanced', 'expert'],
    default: 'novice'
  },
  rankProgress: {
    type: String,
    required: true
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
