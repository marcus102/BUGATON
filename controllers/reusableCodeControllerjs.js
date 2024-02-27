const ReusableCode = require('./../models/reusableCodeModel');
const User = require('./../models/userModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const appError = require('../utils/appError');

// exports.setRequiredIds = (req, res, next) => {
//   const setIfUndefined = (field, value) => {
//     if (!req.body[field]) req.body[field] = value;
//   };
//   setIfUndefined('user', req.user.id);

//   next();
// };

exports.createReusableCode = catchAsync(async (req, res, next) => {
  const newBlogPost = await ReusableCode.create(req.body);

  await User.findByIdAndUpdate(req.user.id, { $inc: { reusableCodeCount: 1 } });

  res.status(201).json({
    status: 'success',
    data: newBlogPost
  });
});

exports.getAllReusableCodes = factory.getAll(ReusableCode);
exports.getReusableCode = factory.getOne(ReusableCode, [{ path: 'image' }, { path: 'comments' }]);
exports.updateReusableCode = factory.updateOne(ReusableCode);

exports.deleteReusableCode = catchAsync(async (req, res, next) => {
  const doc = await ReusableCode.findByIdAndDelete(req.params.id);

  if (!doc) {
    return next(appError('No document found with that ID! ', 404));
  }

  await User.findByIdAndUpdate(req.user.id, { $inc: { reusableCodeCount: -1 } });

  res.status(200).json({
    status: 'success',
    data: null
  });
});
