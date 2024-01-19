const mongoose = require('mongoose');
const appError = require('../utils/appError');
const BugFixes = require('./../models/bugFixesModel');
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
  { path: 'childSolutions' }
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

exports.createBugFix = catchAsync(async (req, res, next) => {
  const createComment = await BugFixes.create({
    solution: req.body.solution,
    description: req.body.description,
    result: req.body.result,
    parentSolution: req.params.id,
    user: req.body.user,
    bugReport: req.body.bugReport,
    frameworkVersions: req.body.frameworkVersions
  });

  if (req.params.id) {
    await BugFixes.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { totalAttempts: 1 },
        $addToSet: { contributors: req.body.user }
      },
      { new: true }
    );
  }

  res.status(201).json({
    status: 'success',
    data: createComment
  });
});
