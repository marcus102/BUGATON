const Like = require('../../models/user_engagement/likesModel');
const BugFixes = require('../../models/bugFixesModel');
const ReusableCode = require('../../models/reusableCodeModel');
const Blog = require('./../../models/blogPostModel');
const Comment = require('./../../models/user_engagement/commentModel');
const catchAsync = require('../../utils/catchAsync');
const factory = require('../handlerFactory');
const appError = require('../../utils/appError');

exports.setRequiredIds = (req, res, next) => {
  const setIfUndefined = (field, value) => {
    if (!req.body[field]) req.body[field] = value;
  };

  setIfUndefined('user', req.user.id);
  setIfUndefined('reusableCode', req.params.reusable_code_id);
  setIfUndefined('bugFix', req.params.bug_fixes_id);
  setIfUndefined('blogPost', req.params.blog_post_id);
  setIfUndefined('comment', req.params.comment_id);

  next();
};

exports.toggleLike = catchAsync(async (req, res, next) => {
  const { bugFix, reusableCode, blogPost, user, comment } = req.body;
  if (!(bugFix || reusableCode || blogPost || comment)) {
    return next(appError('This operation cannot be performed!', 401));
  }

  let dataField;
  let DB;

  if (bugFix) {
    dataField = 'bugFix';
    DB = BugFixes;
  } else if (reusableCode) {
    dataField = 'reusableCode';
    DB = ReusableCode;
  } else if (blogPost) {
    dataField = 'blogPost';
    DB = Blog;
  } else if (comment) {
    dataField = 'comment';
    DB = Comment;
  }

  const query = { user: user, [dataField]: req.body[dataField] };

  const existingLike = await Like.findOne(query);

  if (existingLike) {
    await Like.findOneAndDelete(query);
    await DB.findByIdAndUpdate(req.body[dataField], {
      $inc: { likeCount: -1 }
    });
  } else {
    const likeData = { user: user, [dataField]: req.body[dataField] };
    const newLike = new Like(likeData);
    await newLike.save();
    await DB.findByIdAndUpdate(req.body[dataField], { $inc: { likeCount: 1 } });
  }

  res.status(200).json({ status: 'success' });
});

exports.getAllUsersThatLikePosts = factory.getAll(Like);
exports.getUserThatLikePosts = factory.getOne(Like);
exports.deleteMultiplebugFixesLikesById = factory.deleteMany(Like, 'bugFix');

exports.deleteMultiplebugFixesLikesByArraysOfIds = factory.deleteArray(Like, 'bugFix');
