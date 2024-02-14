const ReusableCode = require('./../models/reusableCodeModel');
const factory = require('./handlerFactory');

exports.setRequiredIds = (req, res, next) => {
  const setIfUndefined = (field, value) => {
    if (!req.body[field]) req.body[field] = value;
  };
  setIfUndefined('user', req.user.id);

  next();
};

exports.getAllReusableCodes = factory.getAll(ReusableCode);
exports.createReusableCode = factory.createOne(ReusableCode);
exports.getReusableCode = factory.getOne(ReusableCode, [{ path: 'image' }, { path: 'comments' }]);
exports.deleteReusableCode = factory.deleteOne(ReusableCode);
exports.updateReusableCode = factory.updateOne(ReusableCode);
