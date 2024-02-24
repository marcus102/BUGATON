const Language = require('./../../models/filtering/programmingLanguagesModel');
const BugReport = require('./../../models/bugReportModel');
const BugFixes = require('./../../models/bugFixesModel');
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
  setIfUndefined('username', req.user.username);
  setIfUndefined('bugReport', req.params.bug_id);
  setIfUndefined('bugFix', req.params.bug_fixes_id);
  setIfUndefined('reusableCode', req.params.reusable_code_id);
  setIfUndefined('blogPost', req.params.blog_post_id);

  next();
};

exports.checkInfo = catchAsync(async (req, res, next) => {
  const { bugReport, reusableCode, bugFix, blogPost } = req.body;

  let id;
  let DB;

  if (bugFix) {
    id = bugFix;
    DB = BugFixes;
  } else if (reusableCode) {
    id = reusableCode;
    DB = ReusableCode;
  } else if (blogPost) {
    id = blogPost;
    DB = Blog;
  } else if (bugReport) {
    id = bugReport;
    DB = BugReport;
  }

  const targetDoc = await DB.findById(id);

  if (!targetDoc) {
    return next(appError('You cannot perform this action', 405));
  }

  next();
});

exports.createLanguage = catchAsync(async (req, res, next) => {
  const { user, username, bugReport, bugFix, reusableCode, blogPost, language } = req.body;

  let updatedUsername = username;

  if (bugReport || bugFix || reusableCode || blogPost) {
    updatedUsername = null;
  }

  const newLanguage = await Language.create({
    language: language,
    user: user,
    username: updatedUsername,
    bugReport: bugReport,
    bugFix: bugFix,
    reusableCode: reusableCode,
    blogPost: blogPost
  });

  res.status(201).json({
    status: 'success',
    data: newLanguage
  });
});
exports.getAllLanguages = factory.getAll(Language);
exports.getLanguage = factory.getOne(Language);
exports.updateLanguage = factory.updateOne(Language);
exports.deleteLanguage = factory.deleteOne(Language);

exports.deleteMultipleBugReportLanguageById = factory.deleteMany(Language, 'bugReport');
exports.deleteMultipleReusableCodeLanguageById = factory.deleteMany(Language, 'reusableCode');
exports.deleteMultipleBlogPostLanguageById = factory.deleteMany(Language, 'blogPost');
