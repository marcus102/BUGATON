const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: false
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null
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
      default: Date.now
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.virtual('image', {
  ref: 'Image',
  localField: '_id',
  foreignField: 'review'
});

reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'username profile'
  }).populate({
    path: 'bugFix',
    select: 'solution user status'
  });

  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
