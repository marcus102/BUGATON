const OperatingSystem = require('../../models/filtering/operatingSystemModel');
const BugReport = require('../../models/bugReportModel');
const UserAttempt = require('../../models/bugFixesModel');
const ReusableCode = require('../../models/reusableCodeModel');
const Blog = require('../../models/blogPostModel');
const factory = require('../handlerFactory');
const catchAsync = require('../../utils/catchAsync');
const appError = require('../../utils/appError');

exports.setRequiredIds = (req, res, next) => {
  const setIfUndefined = (field, value) => {
    if (!req.body[field]) req.body[field] = value;
  };
  setIfUndefined('user', req.user.id);
  setIfUndefined('username', req.user.username);
  setIfUndefined('bugReport', req.params.bug_id);
  setIfUndefined('bugFix', req.params.bug_fixes_id);
  setIfUndefined('reusableCode', req.params.reusable_code_id);
  setIfUndefined('blogPost', req.params.blog_post_id);

  next();
};

exports.checkInfo = catchAsync(async (req, res, next) => {
  const { bugReport, reusableCode, bugFix, blogPost } = req.body;

  const bugReportDoc = await BugReport.findById(bugReport);
  const bugFixDoc = await UserAttempt.findById(bugFix);
  const reusableCodeDoc = await ReusableCode.findById(reusableCode);
  const blogPostDoc = await Blog.findById(blogPost);

  if (!(bugReportDoc || bugFixDoc || reusableCodeDoc || blogPostDoc)) {
    return next(appError('You cannot perform this action', 405));
  }

  next();
});

exports.createOsPlatform = catchAsync(async (req, res, next) => {
  const { user, username, bugReport, bugFix, reusableCode, blogPost, operatingSystem } = req.body;

  let updatedUsername = username;

  if (bugReport || bugFix || reusableCode || blogPost) {
    updatedUsername = null;
  }

  const newOsPlatform = await OperatingSystem.create({
    operatingSystem: operatingSystem,
    user: user,
    username: updatedUsername,
    bugReport: bugReport,
    bugFix: bugFix,
    reusableCode: reusableCode,
    blogPost: blogPost
  });

  res.status(201).json({
    status: 'success',
    data: newOsPlatform
  });
});
exports.getAllOsPlatforms = factory.getAll(OperatingSystem);
exports.getOsPlatform = factory.getOne(OperatingSystem);
exports.updateOsPlatform = factory.updateOne(OperatingSystem);
exports.deleteOsPlatform = factory.deleteOne(OperatingSystem);

exports.deleteMultipleBugReportOsPlatformById = factory.deleteMany(OperatingSystem, 'bugReport');
exports.deleteMultipleReusableCodeOsPlatformById = factory.deleteMany(OperatingSystem, 'reusableCode');
exports.deleteMultipleBlogPostOsPlatformById = factory.deleteMany(OperatingSystem, 'blogPost');
