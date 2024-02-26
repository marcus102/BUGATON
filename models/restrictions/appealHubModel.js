const mongoose = require('mongoose');

const appealSchema = new mongoose.Schema({
  accountId: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const Appeal = mongoose.model('Appeal', appealSchema);

module.exports = Appeal;
