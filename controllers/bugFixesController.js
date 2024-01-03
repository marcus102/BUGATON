// const appError = require('../utils/appError');
const BugFixes = require('./../models/bugFixesModel');
const factory = require('./handlerFactory');
// const catchAsync = require('../utils/catchAsync');

exports.setRequiredIds = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.bugReport) req.body.bugReport = req.params.bug_id;
  next();
};

exports.createBugFix = factory.createOne(BugFixes);
exports.getALLBugFixes = factory.getAll(BugFixes);
exports.getBugFix = factory.getOne(BugFixes);
exports.updateBugFix = factory.updateOne(BugFixes);
exports.deleteBugFix = factory.deleteOne(BugFixes);
