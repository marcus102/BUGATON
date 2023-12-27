const mongoose = require('mongoose');

const bugReportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    stepsToReproduce: {
      type: String,
      required: true
    },
    expectedBehavior: {
      type: String,
      required: true
    },
    actualBehavior: {
      type: String,
      required: true
    },
    browser: {
      type: String
    },
    operatingSystem: {
      type: String
    },
    device: {
      type: String
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    status: {
      type: String,
      enum: ['new', 'assigned', 'in-progress', 'resolved', 'closed'],
      default: 'new'
    },
    images: {
      type: [String]
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A bug report must belong to a user!']
    },
    assignedTo: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      default: null
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date
    }
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

bugReportSchema.virtual('userAttempts', {
  ref: 'UserAttempt',
  localField: '_id',
  foreignField: 'bugReport',
  justOne: false
});

const BugReport = mongoose.model('BugReport', bugReportSchema);

module.exports = BugReport;
