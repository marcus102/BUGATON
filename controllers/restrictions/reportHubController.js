const ReportHub = require('../../models/restrictions/reportHubModel');
const User = require('../../models/userModel');
const BugReport = require('./../../models/bugReportModel');
const BugFixes = require('./../../models/bugFixesModel');
const ReusableCode = require('./../../models/reusableCodeModel');
const Blog = require('./../../models/blogPostModel');
const Comment = require('./../../models/user_engagement/commentModel');
const catchAsync = require('../../utils/catchAsync');
const appError = require('../../utils/appError');
const factory = require('../handlerFactory');

exports.setRequiredIds = (req, res, next) => {
  const setIfUndefined = (field, value) => {
    if (!req.body[field]) req.body[field] = value;
  };
  setIfUndefined('user', req.user.id);
  setIfUndefined('targetAccount', req.params.account_id);
  setIfUndefined('bugReport', req.params.bug_id);
  setIfUndefined('bugFix', req.params.bug_fixes_id);
  setIfUndefined('reusableCode', req.params.reusable_code_id);
  setIfUndefined('blogPost', req.params.blog_post_id);
  setIfUndefined('comment', req.params.comment_id);

  next();
};

exports.checkInfo = catchAsync(async (req, res, next) => {
  const { bugReport, reusableCode, bugFix, blogPost, targetAccount, user, comment } = req.body;

  let id;
  let DB;
  let dataField;

  if (bugFix) {
    id = bugFix;
    DB = BugFixes;
    dataField = 'bugFix';
  } else if (reusableCode) {
    id = reusableCode;
    DB = ReusableCode;
    dataField = 'reusableCode';
  } else if (blogPost) {
    id = blogPost;
    DB = Blog;
    dataField = 'blogPost';
  } else if (targetAccount) {
    id = targetAccount;
    DB = User;
    dataField = 'targetAccount';
  } else if (bugReport) {
    id = bugReport;
    DB = BugReport;
    dataField = 'bugReport';
  } else if (comment) {
    id = comment;
    DB = Comment;
    dataField = 'comment';
  }

  const targetDoc = await DB.findById(id);

  if (!targetDoc) {
    return next(appError('You cannot perform this action', 405));
  }

  const reporterDoc = await ReportHub.findOne({ reporter: user, [dataField]: req.body[dataField] });

  if (reporterDoc) {
    return next(appError('You have already reported this element', 409));
  }

  next();
});

exports.reportAccount = catchAsync(async (req, res, next) => {
  const {
    bugReport,
    reusableCode,
    bugFix,
    blogPost,
    targetAccount,
    user,
    comment,
    reason,
    otherReason,
    description
  } = req.body;

  let DB;
  let dataField;

  if (bugFix) {
    DB = BugFixes;
    dataField = 'bugFix';
  } else if (reusableCode) {
    DB = ReusableCode;
    dataField = 'reusableCode';
  } else if (blogPost) {
    DB = Blog;
    dataField = 'blogPost';
  } else if (targetAccount) {
    DB = User;
    dataField = 'targetAccount';
  } else if (bugReport) {
    DB = BugReport;
    dataField = 'bugReport';
  } else if (comment) {
    DB = Comment;
    dataField = 'comment';
  }

  const newReport = new ReportHub({
    reporter: user,
    targetAccount: targetAccount,
    bugFix: bugFix,
    bugReport: bugReport,
    reusableCode: reusableCode,
    blogPost: blogPost,
    comment: comment,
    reason: reason,
    otherReason: otherReason,
    description: description
  });
  await newReport.save();

  await DB.findByIdAndUpdate(req.body[dataField], { $inc: { reportCount: 1 } });

  res.status(201).json({
    status: 'success',
    data: newReport
  });
});

exports.updateReportedAccount = factory.updateOne(ReportHub); // user will be allowed to change report for 24h max
exports.getRepotedAccount = factory.getOne(ReportHub); // accessible by user for 24h, admin and medoreator
exports.getAllReportedAccounts = factory.getAll(ReportHub); // only accessible by admin and medoreator
exports.deleteAccountReport = factory.deleteOne(ReportHub); // user will be allowed to delete report for 24h max

exports.deleteAccountReport = catchAsync(async (req, res, next) => {
  const reportDoc = await ReportHub.findById(req.params.id);

  if (!reportDoc) {
    return next(appError('This doccument does not exist', 405));
  }
  const { bugReport, reusableCode, bugFix, blogPost, targetAccount, comment } = reportDoc;

  let objID;
  let DB;

  if (bugFix) {
    objID = bugFix;
    DB = BugFixes;
  } else if (reusableCode) {
    objID = reusableCode.valueOf();
    DB = ReusableCode;
  } else if (blogPost) {
    objID = blogPost.valueOf();
    DB = Blog;
  } else if (targetAccount) {
    objID = targetAccount.valueOf();
    DB = User;
  } else if (bugReport) {
    objID = bugReport.valueOf();
    DB = BugReport;
  } else if (comment) {
    objID = comment.valueOf();
    DB = Comment;
  }

  await DB.findByIdAndUpdate(objID, { $inc: { reportCount: -1 } });

  await ReportHub.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: 'success'
  });
});
