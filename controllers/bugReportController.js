const BugReport = require('./../models/bugReportModel');
const User = require('./../models/userModel');
const BlockedUser = require('./../models/restrictions/blockedUserModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');

exports.assignBugToUser = factory.handleBugAssignment('assign', User, BugReport);
exports.deassignBugFromUser = factory.handleBugAssignment('deassign', User, BugReport);

exports.createBug = catchAsync(async (req, res, next) => {
  const {
    title,
    description,
    stepsToReproduce,
    expectedBehavior,
    actualBehavior,
    codeSnippet,
    browser,
    device,
    severity
  } = req.body;

  const newBugReport = new BugReport({
    title: title,
    description: description,
    stepsToReproduce: stepsToReproduce,
    expectedBehavior: expectedBehavior,
    actualBehavior: actualBehavior,
    codeSnippet: codeSnippet,
    browser: browser,
    device: device,
    severity: severity,
    user: req.user.id
  });

  await newBugReport.save();

  await User.findByIdAndUpdate(req.user.id, { $inc: { bugReportCount: 1 } });

  res.status(201).json({
    status: 'success',
    data: newBugReport
  });
});

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

exports.filterBlockedBugs = factory.blocksHandler(BlockedUser, 'bug_ids');

exports.getAllBugs = factory.getAll(BugReport, 'bug_ids');
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
