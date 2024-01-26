// const appError = require('../utils/appError');
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

exports.createComment = catchAsync(async (req, res, next) => {
  const { user, bug, bugFix, reusableCode, comment } = req.body;
  const { id } = req.params;

  if (!bug || !bugFix || !reusableCode) {
    return next('You are not allowed to perform this action!', 405);
  }

  const createComment = await Comment.create({
    comment: comment,
    parentComment: id,
    user: user,
    bug: bug,
    bugFix: bugFix,
    reusableCode: reusableCode
  });

  res.status(201).json({
    status: 'success',
    data: createComment
  });
});
exports.getAllComments = factory.getAll(Comment, { path: 'childComments' });
exports.getComment = factory.getOne(Comment, { path: 'childComments' });
exports.deleteComment = factory.deleteOne(Comment);
exports.updateComment = factory.updateOne(Comment);
