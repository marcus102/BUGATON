// const appError = require('../utils/appError');
const Contributor = require('./../models/contributorsModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');

exports.createContribution = catchAsync(async (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'Cannot perorm this action with this url!'
  });
});

exports.getAllContributions = factory.getAll(Contributor);
exports.getContribution = factory.getOne(Contributor, {
  path: 'childContributions'
});
exports.deleteContribution = factory.deleteOne(Contributor);
exports.updateContribution = factory.updateOne(Contributor);
