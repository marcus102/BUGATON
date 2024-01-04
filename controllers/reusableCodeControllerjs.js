const ReusableCode = require('./../models/reusableCodeModel');
// const APIFeatures = require('./../utils/apiFeatures');
// const catchAsync = require('./../utils/catchAsync');
// const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

exports.setRequiredIds = (req, res, next) => {
  const setIfUndefined = (field, value) => {
    if (!req.body[field]) req.body[field] = value;
  };
  setIfUndefined('user', req.user.id);
  setIfUndefined('bugFix', req.params.bug_fixes_id);

  next();
};

exports.getAllReusableCodes = factory.getAll(ReusableCode);
exports.createReusableCode = factory.createOne(ReusableCode);
exports.getReusableCode = factory.getOne(ReusableCode, { path: 'image' });
exports.deleteReusableCode = factory.deleteOne(ReusableCode);
exports.updateReusableCode = factory.updateOne(ReusableCode);
