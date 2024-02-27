const BugReport = require('./../models/bugReportModel');
const User = require('./../models/userModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');

exports.assignBugToUser = factory.handleBugAssignment('assign', User, BugReport);
exports.deassignBugFromUser = factory.handleBugAssignment('deassign', User, BugReport);

exports.createBug = catchAsync(async (req, res, next) => {
  const newBugReport = await BugReport.create(req.body);

  await User.findByIdAndUpdate(req.user.id, { $inc: { bugReportCount: 1 } });

  res.status(201).json({
    status: 'success',
    data: newBugReport
  });
});

exports.getAllBugs = factory.getAll(BugReport);
exports.getBug = factory.getOne(BugReport, [
  { path: 'userAttempts' },
  { path: 'image' },
  { path: 'contributors' },
  { path: 'comments' },
  { path: 'categories' },
  { path: 'operatingSystem' },
  { path: 'programmingLanguages' },
  { path: 'zoneOfInterests' }
]);
exports.updateBug = factory.updateOne(BugReport);

exports.deleteBug = catchAsync(async (req, res, next) => {
  const doc = await BugReport.findByIdAndDelete(req.params.id);

  if (!doc) {
    return next(appError('No document found with that ID! ', 404));
  }

  await User.findByIdAndUpdate(req.user.id, { $inc: { bugReportCount: -1 } });

  res.status(200).json({
    status: 'success',
    data: null
  });
});
