const BugReport = require('./../models/bugReportModel');
// const catchAsync = require('../utils/catchAsync');
// const appError = require('./../utils/appError');
const factory = require('./handlerFactory');

exports.setRequiredIds = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createBug = factory.createOne(BugReport);
exports.getAllBugs = factory.getAll(BugReport);
exports.getBug = factory.getOne(BugReport, [
  { path: 'userAttempts' },
  { path: 'image' }
]);
exports.updateBug = factory.updateOne(BugReport);
exports.deleteBug = factory.deleteOne(BugReport);
