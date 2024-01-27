const mongoose = require('mongoose');
const appError = require('../utils/appError');
const BugFixes = require('./../models/bugFixesModel');
const BugReport = require('./../models/bugReportModel');
const Contributor = require('./../models/contributorsModel');
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

exports.getALLBugFixes = factory.getAll(BugFixes, { path: 'childSolutions' });
exports.getBugFix = factory.getOne(BugFixes, [
  { path: 'image' },
  { path: 'reviews' },
  { path: 'comments' },
  { path: 'childSolutions' },
  { path: 'contributors' }
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
exports.deleteMultipleBugFixesById = factory.deleteMany(BugFixes, 'bugReport');

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

exports.createBugFix = catchAsync(async (req, res, next) => {
  const {
    solution,
    description,
    result,
    user,
    bugReport,
    frameworkVersions
  } = req.body;
  const { id } = req.params;

  const bugFix = await BugFixes.findById(id);
  const bug = await BugReport.findById(bugReport);

  if (!bug) {
    return next(appError('Bug does not exist!', 404));
  }

  if (id) {
    if (!bugFix) {
      return next(appError('Bug fix does not exist!', 404));
    }
  }

  const newBugFix = await BugFixes.create({
    solution: solution,
    description: description,
    result: result,
    user: user,
    bugReport: bugReport,
    parentSolution: id,
    frameworkVersions: frameworkVersions
  });

  await Contributor.create({
    user: user,
    bugFix: newBugFix._id,
    bugReport: bugReport
  });

  res.status(201).json({
    status: 'success',
    data: newBugFix
  });
});
