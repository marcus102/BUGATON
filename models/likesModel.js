const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bugFix: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserAttempt'
  },
  reusableCode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ReusableCode'
  },
  timestamp: {
    type: Date,
    default: Date.now()
  }
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
