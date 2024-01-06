const Feedback = require('./../models/feedbackModel');
// const APIFeatures = require('./../utils/apiFeatures');
// const catchAsync = require('./../utils/catchAsync');
// const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

exports.setRequiredIds = (req, res, next) => {
  const setIfUndefined = (field, value) => {
    if (!req.body[field]) req.body[field] = value;
  };
  setIfUndefined('user', req.user.id);

  next();
};

exports.getAllFeedbacks = factory.getAll(Feedback);
exports.createFeedback = factory.createOne(Feedback);
exports.getFeedback = factory.getOne(Feedback);
exports.deleteFeedback = factory.deleteOne(Feedback);
exports.updateFeedback = factory.updateOne(Feedback);
