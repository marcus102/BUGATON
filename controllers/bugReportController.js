const BugReport = require('./../models/bugReportModel');
const User = require('./../models/userModel');
const factory = require('./handlerFactory');

exports.setRequiredIds = (req, res, next) => {
  const setIfUndefined = (field, value) => {
    if (!req.body[field]) req.body[field] = value;
  };
  setIfUndefined('user', req.user.id);
  setIfUndefined('bugReport', req.params.id);

  next();
};

exports.assignBugToUser = factory.handleAssignment('assign', User, BugReport);
exports.deassignBugFromUser = factory.handleAssignment(
  'deassign',
  User,
  BugReport
);

exports.createBug = factory.createOne(BugReport);
exports.getAllBugs = factory.getAll(BugReport);
exports.getBug = factory.getOne(BugReport, [
  { path: 'userAttempts' },
  { path: 'image' }
]);
exports.updateBug = factory.updateOne(BugReport);
exports.deleteBug = factory.deleteOne(BugReport);
