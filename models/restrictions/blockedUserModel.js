const mongoose = require('mongoose');

const blockedUserSchema = new mongoose.Schema({
  blockedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'The blocker is required!']
  },
  blockedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'the blocked user is required!']
  },
  reason: String,
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const BlockedUser = mongoose.model('BlockedUser', blockedUserSchema);

module.exports = BlockedUser;
