const mongoose = require('mongoose');

const zoneOfInterestSchema = new mongoose.Schema(
  {
    zoneOfInterest: [
      {
        type: String,
        enum: [
          'education',
          'technology',
          'programming',
          'networking',
          'data Science',
          'security',
          'artificial Intelligence',
          'web Development',
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

const ZoneOfInterest = mongoose.model('ZoneOfInterest', zoneOfInterestSchema);

module.exports = ZoneOfInterest;
