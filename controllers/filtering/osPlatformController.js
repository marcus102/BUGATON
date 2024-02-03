const OsPlatform = require('./../../models/filtering/osPlatformModel');
const BugReport = require('./../../models/bugReportModel');
const UserAttempt = require('./../../models/bugFixesModel');
const ReusableCode = require('./../../models/reusableCodeModel');
const Blog = require('./../../models/blogPostModel');
const factory = require('./../handlerFactory');
const catchAsync = require('./../../utils/catchAsync');
const appError = require('./../../utils/appError');

exports.setRequiredIds = (req, res, next) => {
  const setIfUndefined = (field, value) => {
    if (!req.body[field]) req.body[field] = value;
  };
  setIfUndefined('user', req.user.id);
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
  const {
    user,
    bugReport,
    bugFix,
    reusableCode,
    blogPost,
    osPlatform
  } = req.body;

  const newOsPlatform = await OsPlatform.create({
    osPlatform: osPlatform,
    user: user,
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
exports.getAllOsPlatforms = factory.getAll(OsPlatform);
exports.getOsPlatform = factory.getOne(OsPlatform);
exports.updateOsPlatform = factory.updateOne(OsPlatform);

exports.deleteOsPlatform = catchAsync(async (req, res, next) => {
  return appError('You are not allowed to delete os platform', 500);
});
