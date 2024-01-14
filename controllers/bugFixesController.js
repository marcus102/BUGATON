const mongoose = require('mongoose');
const appError = require('../utils/appError');
const BugFixes = require('./../models/bugFixesModel');
// const BugReport = require('./../models/bugReportModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const filterParams = require('./../utils/filterParams');

exports.setRequiredIds = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.bugReport) req.body.bugReport = req.params.bug_id;
  next();
};

exports.createBugFix = factory.createOne(BugFixes);
exports.getALLBugFixes = factory.getAll(BugFixes);
exports.getBugFix = factory.getOne(BugFixes, [
  { path: 'image' },
  { path: 'reviews' },
  { path: 'comments' }
]);

exports.updateBugFix = catchAsync(async (req, res, next) => {
  const bugFix = await BugFixes.findById(req.params.id);

  if (!bugFix) {
    return next(appError('Bug Fix not found!', 404));
  }

  const filteredBody = filterParams.excludedFields(req.body, 'status');

  const updatedBugFix = await BugFixes.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(201).json({
    status: 'success',
    data: updatedBugFix
  });
});

exports.deleteBugFix = factory.deleteOne(BugFixes);

exports.getUserTotalBugFixes = catchAsync(async (req, res, next) => {
  const userId = req.body.user;

  const result = await BugFixes.aggregate([
    {
      $match: { user: new mongoose.Types.ObjectId(userId) }
    },
    {
      $group: {
        _id: null,
        totalAttempts: { $sum: 1 },
        bugIds: { $push: '$_id' }
      }
    },
    {
      $project: {
        _id: 0,
        totalAttempts: 1,
        bugIds: 1
      }
    }
  ]);

  if (result.length === 0) {
    return next(appError('User not found or no bug fixes for the user.', 404));
  }

  const userBugFixes = result[0];
  res.status(200).json({
    status: 'success',
    data: {
      userBugFixes
    }
  });
});
