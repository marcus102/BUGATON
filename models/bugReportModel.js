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
      type: String,
      enum: [
        'Chrome',
        'Firefox',
        'Safari',
        'Edge',
        'Internet Explorer',
        'Opera',
        'Brave',
        'Other'
      ],
      default: 'Other'
    },
    operatingSystem: {
      type: String,
      enum: [
        'Windows',
        'macOS',
        'Linux',
        'iOS',
        'Android',
        'Windows Phone',
        'Other'
      ],
      default: 'Other'
    },
    device: {
      type: String,
      enum: [
        'Desktop',
        'Laptop',
        'Tablet',
        'Mobile',
        'Smartphone',
        'Smartwatch',
        'Other'
      ],
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
    assignedTo: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      default: null
    },
    createdAt: {
      type: Date,
      default: Date.now()
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
  foreignField: 'bugReport'
});

bugReportSchema.virtual('image', {
  ref: 'Image',
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

bugReportSchema.pre('save', function(next) {
  const fieldsToCheck = [
    'title',
    'description',
    'stepsToReproduce',
    'expectedBehavior',
    'actualBehavior',
    'images'
    // Add other fields as needed
  ];

  if (fieldsToCheck.some(field => this.isModified(field))) {
    this.updatedAt = Date.now();
  }

  next();
});

const BugReport = mongoose.model('BugReport', bugReportSchema);

module.exports = BugReport;
