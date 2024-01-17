const BugReport = require('./../models/bugReportModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const appError = require('./../utils/appError');

exports.setRequiredIds = (req, res, next) => {
  const setIfUndefined = (field, value) => {
    if (!req.body[field]) req.body[field] = value;
  };
  setIfUndefined('user', req.user.id);
  setIfUndefined('bugReport', req.params.id);

  next();
};

exports.assignBugToUser = catchAsync(async (req, res, next) => {
  const bug = await BugReport.findById(req.body.bugReport);

  if (!bug) {
    return next(appError('Documment not found', 404));
  }

  if (!bug.assignedTo) {
    bug.assignedTo = req.params.assigneeId;
  } else {
    bug.assignedTo.push(req.params.assigneeId);
  }

  await bug.save();

  const updatedBug = await BugReport.findById(req.body.bugReport);

  res.status(200).json({
    status: 'success',
    data: updatedBug
  });
});

exports.deassignBugFromUser = catchAsync(async (req, res, next) => {
  const bug = await BugReport.findById(req.body.bugReport);

  if (!bug) {
    return next(appError('Documment not found', 404));
  }

  await BugReport.updateOne(
    { _id: req.body.bugReport },
    { $pull: { assignedTo: req.params.assigneeId } }
  );

  const updatedBug = await BugReport.findById(req.body.bugReport);

  res.status(200).json({
    status: 'success',
    data: updatedBug
  });
});

exports.createBug = factory.createOne(BugReport);
exports.getAllBugs = factory.getAll(BugReport);
exports.getBug = factory.getOne(BugReport, [
  { path: 'userAttempts' },
  { path: 'image' }
]);
exports.updateBug = factory.updateOne(BugReport);
exports.deleteBug = factory.deleteOne(BugReport);
