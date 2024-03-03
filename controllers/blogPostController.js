const Blog = require('../models/blogPostModel');
const User = require('./../models/userModel');
const BlockedUser = require('./../models/restrictions/blockedUserModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const appError = require('../utils/appError');

exports.createBlogPost = catchAsync(async (req, res, next) => {
  const { content, title } = req.body;
  const newBlogPost = new Blog({
    title: title,
    content: content,
    user: req.user.id
  });

  await newBlogPost.save();

  await User.findByIdAndUpdate(req.user.id, { $inc: { blogPostCount: 1 } });

  res.status(201).json({
    status: 'success',
    data: newBlogPost
  });
});

exports.filterBlockedBugFixes = factory.blocksHandler(BlockedUser, 'blog_post_ids');

exports.getAllBlogPosts = factory.getAll(Blog, 'blog_post_ids');
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
