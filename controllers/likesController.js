const Like = require('./../models/likesModel');
const BugFixes = require('./../models/bugFixesModel');
const ReusableCode = require('./../models/reusableCodeModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
// const appError = require('./../utils/appError');

exports.setRequiredIds = (req, res, next) => {
  const setIfUndefined = (field, value) => {
    if (!req.body[field]) req.body[field] = value;
  };
  setIfUndefined('user', req.user.id);
  setIfUndefined('reusableCode', req.params.reusable_code_id);
  setIfUndefined('bugFix', req.params.bug_fixes_id);

  next();
};

exports.toggleLike = catchAsync(async (req, res, next) => {
  let data = req.body.bugFix;
  let DB = BugFixes;
  if (!req.body.bugFix) {
    data = req.body.reusableCode;
    DB = ReusableCode;
  }

  const existingLike = await Like.findOne({
    user: req.body.user,
    likedItemId: data
  });

  if (existingLike) {
    await Like.findOneAndDelete({ user: req.body.user, likedItemId: data });
    await DB.findByIdAndUpdate(data, { $inc: { likeCount: -1 } });
  } else {
    const newLike = new Like({ user: req.body.user, likedItemId: data });
    await newLike.save();
    await DB.findByIdAndUpdate(data, { $inc: { likeCount: 1 } });
  }

  res.status(200).json({ status: 'success' });
});

exports.getAllUsersThatLikePosts = factory.getAll(Like);
exports.getUserThatLikePosts = factory.getOne(Like);
