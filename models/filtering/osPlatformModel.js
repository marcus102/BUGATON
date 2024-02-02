const mongoose = require('mongoose');

const osPaltformSchema = new mongoose.Schema(
  {
    osPlatform: [
      {
        type: String,
        enum: [
          'android',
          'cross-platform',
          'ios',
          'linux',
          'macOS',
          'web',
          'windows',
          'other'
        ],
        default: 'other'
      }
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    bugReport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BugReport'
    },
    bugFix: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserAttempt'
    },
    reusableCode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ReusableCode'
    },
    blogPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    },
    timestamp: {
      type: Date,
      default: Date.now()
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const OsPlatform = mongoose.model('OsPlatform', osPaltformSchema);

module.exports = OsPlatform;
