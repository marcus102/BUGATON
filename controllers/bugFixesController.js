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

// exports.updateBugReportAttempts = catchAsync(async (req, res, next) => {});
exports.deleteBugFix = factory.deleteOne(BugFixes);
