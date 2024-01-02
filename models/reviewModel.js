const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserAttempt',
      required: true
    },
    content: {
      type: String,
      required: false
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null
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

reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'username profile'
  }).populate({
    path: 'post',
    select: 'solution user status'
  });

  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
