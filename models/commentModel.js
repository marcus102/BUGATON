const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserAttempt'
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    },
    content: {
      type: String,
      required: true
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

commentSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'username profile'
  })
    .populate({
      path: 'post',
      select: 'user solution status'
    })
    .populate({
      path: 'parentComment',
      select: 'user content'
    });

  next();
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
