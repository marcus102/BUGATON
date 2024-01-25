const mongoose = require('mongoose');

const followerSchema = new mongoose.Schema({
  followerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  followingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now()
  }
});

const Follower = mongoose.model('Follower', followerSchema);

module.exports = Follower;
