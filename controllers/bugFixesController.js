const mongoose = require('mongoose');
const appError = require('../utils/appError');
const BugFixes = require('./../models/bugFixesModel');
const BugReport = require('./../models/bugReportModel');
const Contributor = require('./../models/user_engagement/contributorsModel');
const User = require('./../models/userModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const filterParams = require('./../utils/filterParams');

exports.setRequiredIds = (req, res, next) => {
  const setIfUndefined = (field, value) => {
    if (!req.body[field]) req.body[field] = value;
  };
  setIfUndefined('user', req.user.id);
  setIfUndefined('bugReport', req.params.bug_id);

  next();
};

exports.createBugFix = catchAsync(async (req, res, next) => {
  const { solution, description, result, user, frameworkVersions } = req.body;

  const bugFix = await BugFixes.findById(req.params.id);

  const { bugReport } = bugFix;
  const bugReport_ = bugReport.valueOf();

  const targetBugReport = await BugReport.findById(bugReport_);

  if (!targetBugReport) {
    return next(appError('Bug does not exist!', 404));
  }

  if (req.params.id) {
    if (!bugFix) {
      return next(appError('Bug fix does not exist!', 404));
    }

    await BugFixes.findByIdAndUpdate(req.user.id, { $inc: { totalAttempts: 1 } });
  }

  const newBugFix = await BugFixes.create({
    solution: solution,
    description: description,
    result: result,
    user: user,
    bugReport: bugReport_,
    parentSolution: req.params.id,
    frameworkVersions: frameworkVersions
  });

  const { _id } = newBugFix;

  await Contributor.create({
    user: user,
    bugFix: _id,
    bugReport: bugReport_
  });

  await User.findByIdAndUpdate(req.user.id, { $inc: { bugFixesCount: 1 } });

  res.status(201).json({
    status: 'success',
    data: newBugFix
  });
});

exports.getALLBugFixes = factory.getAll(BugFixes, { path: 'childSolutions' });
exports.getBugFix = factory.getOne(BugFixes, [
  { path: 'image' },
  { path: 'reviews' },
  { path: 'comments' },
  { path: 'childSolutions' },
  { path: 'contributors' },
  { path: 'categories' },
  { path: 'operatingSystem' },
  { path: 'programmingLanguages' },
  { path: 'zoneOfInterests' }
]);

exports.updateBugFix = catchAsync(async (req, res, next) => {
  const bugFix = await BugFixes.findById(req.params.id);

  if (!bugFix) {
    return next(appError('Bug Fix not found!', 404));
  }

  const filteredBody = filterParams.excludedFields(req.body, 'status');

  const updatedBugFix = await BugFixes.findByIdAndUpdate(req.params.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(201).json({
    status: 'success',
    data: updatedBugFix
  });
});

exports.deleteBugFix = catchAsync(async (req, res, next) => {
  const doc = await BugFixes.findByIdAndDelete(req.params.id);

  if (!doc) {
    return next(appError('No document found with that ID! ', 404));
  }

  await User.findByIdAndUpdate(req.user.id, { $inc: { bugReportCount: -1 } });
  await BugFixes.findByIdAndUpdate(req.user.id, { $inc: { totalAttempts: -1 } });

  res.status(200).json({
    status: 'success',
    data: null
  });
});

exports.deleteMultipleBugFixesById = factory.deleteMany(BugFixes, 'bugReport', true, true);

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
    data: userBugFixes
  });
});
