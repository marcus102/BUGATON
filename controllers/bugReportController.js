// const appError = require('../utils/appError');
const BugReport = require('./../models/bugReportModel');
const catchAsync = require('../utils/catchAsync');
const appError = require('./../utils/appError');
const factory = require('./handlerFactory');

exports.createBug = factory.createOne(BugReport);
exports.getAllBugs = factory.getAll(BugReport);
exports.getBug = factory.getOne(BugReport, { path: 'userAttempts' });
exports.updateBug = factory.updateOne(BugReport);
exports.deleteBug = factory.deleteOne(BugReport);
