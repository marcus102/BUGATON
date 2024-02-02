const Contributor = require('../../models/user_engagement/contributorsModel');
const factory = require('../handlerFactory');
const catchAsync = require('../../utils/catchAsync');
const appError = require('../../utils/appError');

exports.setRequiredIds = (req, res, next) => {
  const setIfUndefined = (field, value) => {
    if (!req.body[field]) req.body[field] = value;
  };
  setIfUndefined('user', req.user.id);
  setIfUndefined('bugReport', req.params.bug_id);
  setIfUndefined('bugFix', req.params.id);

  next();
};

exports.getAllContributions = factory.getAll(Contributor);
exports.getContribution = factory.getOne(Contributor);
exports.deleteMultipleContributionsById = factory.deleteMany(
  Contributor,
  'bugReport'
);

exports.updateContribution = catchAsync(async (req, res, next) => {
  return next(appError('Cannot perform this action with this url!', 403));
});
exports.createContribution = catchAsync(async (req, res, next) => {
  return next(appError('Cannot perform this action with this url!', 403));
});
exports.deleteContribution = catchAsync(async (req, res, next) => {
  return next(appError('Cannot perform this action with this url!', 403));
});
