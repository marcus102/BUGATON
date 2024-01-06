const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: String,
    rating: {
      type: Number,
      required: [true, 'Please provide a rating.'],
      min: [1, 'Rating must be at least 1.'],
      max: [5, 'Rating must not exceed 5.']
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    bugFix: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserAttempt'
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

reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'username image'
  }).populate({
    path: 'bugFix',
    select: 'solution user status'
  });

  next();
});

reviewSchema.pre('save', function(next) {
  if (!(this.isModified('review') || this.isModified('rating')) || this.isNew)
    return next();

  this.updatedAt = Date.now();
  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
