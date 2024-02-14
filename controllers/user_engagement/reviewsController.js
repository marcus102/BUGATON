const Review = require('../../models/user_engagement/reviewModel');
const factory = require('../handlerFactory');

exports.setRequiredIds = (req, res, next) => {
  const setIfUndefined = (field, value) => {
    if (!req.body[field]) req.body[field] = value;
  };
  setIfUndefined('user', req.user.id);
  setIfUndefined('bugFix', req.params.bug_fixes_id);
  setIfUndefined('blogPost', req.params.blog_post_id);

  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.createReview = factory.createOne(Review);
exports.getReview = factory.getOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteMultiplebugFixesReviewsById = factory.deleteMany(Review, 'bugFix');

exports.deleteMultiplebugFixesReviewsByArrayOfIds = factory.deleteArray(Review, 'bugFix');
