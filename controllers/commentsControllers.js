const Comment = require('./../models/commentModel');
// const APIFeatures = require('./../utils/apiFeatures');
// const catchAsync = require('./../utils/catchAsync');
// const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

exports.setRequiredIds = (req, res, next) => {
  const setIfUndefined = (field, value) => {
    if (!req.body[field]) req.body[field] = value;
  };
  setIfUndefined('user', req.user.id);
  setIfUndefined('bug', req.params.bug_id);
  setIfUndefined('bugFix', req.params.bug_fixes_id);

  next();
};

exports.getAllComments = factory.getAll(Comment);
exports.createComment = factory.createOne(Comment);
exports.getComment = factory.getOne(Comment, { path: 'childComments' });
exports.deleteComment = factory.deleteOne(Comment);
exports.updateComment = factory.updateOne(Comment);
