const Contributor = require('./../models/contributorsModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const appError = require('./../utils/appError');

exports.createContribution = catchAsync(async (req, res, next) => {
  return next(appError('Cannot perform this action with this url!', 403));
});

exports.getAllContributions = factory.getAll(Contributor);
exports.getContribution = factory.getOne(Contributor);
exports.deleteContribution = factory.deleteOne(Contributor);
exports.updateContribution = factory.updateOne(Contributor);
