const mongoose = require('mongoose');

const userAttemptSchema = new mongoose.Schema(
  {
    solution: {
      type: String,
      required: [true, 'Solution is required']
    },
    testingSteps: {
      type: String,
      required: true
    },
    testingResults: {
      type: String,
      required: true
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
    createdAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

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
