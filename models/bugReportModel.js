const mongoose = require('mongoose');

const bugReportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A title must be given the the bug!']
    },
    description: {
      type: String,
      required: [true, 'Description is required for user undersdanding']
    },
    stepsToReproduce: {
      type: String,
      required: [true, 'Please provide the steps that are leading to the bug!']
    },
    expectedBehavior: {
      type: String,
      required: [true, 'The expected behavior of the software is required! Please provide it']
    },
    actualBehavior: {
      type: String,
      required: [true, 'Provide the actual behavior to help users understand more']
    },
    bug: {
      type: String,
      required: [true, 'The bug is required!']
    },
    browser: {
      type: String,
      enum: ['Chrome', 'Firefox', 'Safari', 'Edge', 'Internet Explorer', 'Opera', 'Brave', 'Other'],
      default: 'Other'
    },
    device: {
      type: String,
      enum: ['Desktop', 'Laptop', 'Tablet', 'Mobile', 'Smartphone', 'Smartwatch', 'Other'],
      default: 'Other'
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
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A bug report must belong to a user']
    },
    assignedTo: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        default: []
      }
    ],
    viewCount: {
      type: Number,
      default: 0
    },
    totalAttempts: {
      type: Number,
      default: 0
    },
    shareCount: {
      type: Number,
      default: 0
    },
    reportCount: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: null
    }
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

bugReportSchema.pre('findOneAndUpdate', function(next) {
  this.getUpdate().updatedAt = Date.now();

  next();
});

bugReportSchema.virtual('contributors', {
  ref: 'Contributor',
  localField: '_id',
  foreignField: 'bugReport'
});

bugReportSchema.virtual('userAttempts', {
  ref: 'UserAttempt',
  localField: '_id',
  foreignField: 'bugReport'
});

bugReportSchema.virtual('image', {
  ref: 'Image',
  localField: '_id',
  foreignField: 'bugReport'
});

bugReportSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'bugReport'
});

bugReportSchema.virtual('categories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'bugReport'
});

bugReportSchema.virtual('operatingSystem', {
  ref: 'OperatingSystem',
  localField: '_id',
  foreignField: 'bugReport'
});

bugReportSchema.virtual('programmingLanguages', {
  ref: 'Language',
  localField: '_id',
  foreignField: 'bugReport'
});

bugReportSchema.virtual('zoneOfInterests', {
  ref: 'ZoneOfInterest',
  localField: '_id',
  foreignField: 'bugReport'
});

bugReportSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'username profile'
  }).populate({
    path: 'assignedTo',
    select: 'username profile'
  });

  next();
});

const BugReport = mongoose.model('BugReport', bugReportSchema);

module.exports = BugReport;
