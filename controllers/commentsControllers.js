const appError = require('../utils/appError');
const Comment = require('./../models/commentModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');

exports.setRequiredIds = (req, res, next) => {
  const setIfUndefined = (field, value) => {
    if (!req.body[field]) req.body[field] = value;
  };
  setIfUndefined('user', req.user.id);
  setIfUndefined('bug', req.params.bug_id);
  setIfUndefined('bugFix', req.params.bug_fixes_id);
  setIfUndefined('reusableCode', req.params.reusable_code_id);

  next();
};

exports.getAllComments = factory.getAll(Comment);

exports.createComment = catchAsync(async (req, res, next) => {
  if (!req.body.comment && req.params.id) {
    return next(appError('Comment not specified!', 400));
  }

  const createComment = await Comment.create({
    comment: req.body.comment,
    parentComment: req.params.id,
    user: req.body.user,
    bug: req.body.bug,
    bugFix: req.body.bugFix,
    reusableCode: req.body.reusableCode
  });

  res.status(201).json({
    status: 'success',
    data: createComment
  });
});

exports.getComment = factory.getOne(Comment, { path: 'childComments' });
exports.deleteComment = factory.deleteOne(Comment);
exports.updateComment = factory.updateOne(Comment);
