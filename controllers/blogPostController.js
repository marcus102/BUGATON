const Blog = require('../models/blogPostModel');
const User = require('./../models/userModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const appError = require('../utils/appError');

// exports.setRequiredIds = (req, res, next) => {
//   const setIfUndefined = (field, value) => {
//     if (!req.body[field]) req.body[field] = value;
//   };
//   setIfUndefined('user', req.user.id);

//   next();
// };

exports.createBlogPost = catchAsync(async (req, res, next) => {
  const newBlogPost = await Blog.create(req.body);

  await User.findByIdAndUpdate(req.user.id, { $inc: { blogPostCount: 1 } });

  res.status(201).json({
    status: 'success',
    data: newBlogPost
  });
});

exports.getAllBlogPosts = factory.getAll(Blog);
exports.getBlogPost = factory.getOne(Blog, [
  { path: 'reviews' },
  { path: 'likes' },
  { path: 'comments' },
  { path: 'categories' },
  { path: 'operatingSystem' },
  { path: 'programmingLanguages' },
  { path: 'zoneOfInterests' }
]);
exports.updateBolgPost = factory.updateOne(Blog);

exports.deleteBlogPost = catchAsync(async (req, res, next) => {
  const doc = await Blog.findByIdAndDelete(req.params.id);

  if (!doc) {
    return next(appError('No document found with that ID! ', 404));
  }

  await User.findByIdAndUpdate(req.user.id, { $inc: { blogPostCount: -1 } });

  res.status(200).json({
    status: 'success',
    data: null
  });
});
