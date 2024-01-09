const mongoose = require('mongoose');

const userAttemptSchema = new mongoose.Schema(
  {
    solution: {
      type: String,
      required: [true, 'Solution is required']
    },
    description: {
      type: String,
      default: null
    },
    result: {
      type: String,
      required: [true, 'Result to the solution must be provided!']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Bug solution must have a user']
    },
    bugReport: {
      type: mongoose.Schema.ObjectId,
      ref: 'BugReport',
      required: [true, 'The bug origin must be defined!']
    },
    viewCount: {
      type: Number,
      default: 0
    },
    likeCount: {
      type: Number,
      default: 0
    },
    downloadCount: {
      type: Number,
      default: 0
    },
    shareCount: {
      type: Number,
      default: 0
    },
    frameworkVersions: [
      {
        name: String,
        version: String,
        default: []
      }
    ],
    contributors: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        default: null
      }
    ],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
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

userAttemptSchema.pre('findOneAndUpdate', function(next) {
  this.getUpdate().updatedAt = Date.now();

  next();
});

userAttemptSchema.pre('save', function(next) {
  const fieldsToCheck = [
    'solution',
    'description',
    'result',
    'frameworkVersions',
    'contributors',
    'status'
  ];

  const isFieldsUnmodified = !fieldsToCheck.some(field =>
    this.isModified(field)
  );

  if (isFieldsUnmodified || this.isNew) {
    return next();
  }

  this.updatedAt = Date.now();
  next();
});

userAttemptSchema.virtual('image', {
  ref: 'Image',
  localField: '_id',
  foreignField: 'bugFix'
});

userAttemptSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'username profile'
  }).populate({
    path: 'bugReport',
    select: 'title description'
  });

  next();
});

userAttemptSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'post'
});

userAttemptSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post'
});

const UserAttempt = mongoose.model('UserAttempt', userAttemptSchema);

module.exports = UserAttempt;
