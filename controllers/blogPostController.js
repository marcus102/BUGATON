// const appError = require('../utils/appError');
const Blog = require('../models/blogPostModel');
const factory = require('./handlerFactory');
// const catchAsync = require('../utils/catchAsync');

exports.setRequiredIds = (req, res, next) => {
  const setIfUndefined = (field, value) => {
    if (!req.body[field]) req.body[field] = value;
  };
  setIfUndefined('user', req.user.id);

  next();
};

exports.createBlogPost = factory.createOne(Blog);
exports.getAllBlogPosts = factory.getAll(Blog);
exports.getBlogPost = factory.getOne(Blog, [
  { path: 'likes' },
  { path: 'comments' },
  { path: 'categories' },
  { path: 'operatingSystem' },
  { path: 'programmingLanguages' },
  { path: 'zoneOfInterests' }
]);
exports.updateBolgPost = factory.updateOne(Blog);
exports.deleteBlogPost = factory.deleteOne(Blog);
