const Appeal = require('./../../models/restrictions/appealHubModel');
const User = require('./../../models/userModel');
const catchAsync = require('../../utils/catchAsync');
const appError = require('../../utils/appError');
const factory = require('../handlerFactory');

exports.makeAnAppeal = catchAsync(async (req, res, next) => {
  const targetAccount = await User.findById(req.user.id);

  if (!(targetAccount && targetAccount.acountSatus === 'banned')) {
    return next(appError('You cannot perform this action', 405));
  }

  const newAppeal = new Appeal({
    accountId: req.user.id,
    reason: req.body.reason
  });

  await newAppeal.save();

  await User.findByIdAndUpdate(req.user.id, { $inc: { accountAppealsCount: 1 } });

  res.status(201).json({
    status: 'success',
    data: newAppeal
  });
});

// only for admin
exports.getAppeal = factory.getOne(Appeal);
exports.getAllAppeals = factory.getAll(Appeal);

exports.updateAppeal = catchAsync(async (req, res, next) => {
  const appealDoc = await Appeal.findById(req.params.id);

  if (!appealDoc) {
    return next(appError('Document from that ID does not exist!', 405));
  }

  if (req.body.status === 'approved') {
    const { accountId } = appealDoc;
    await User.findByIdAndUpdate(accountId.valueOf(), { acountSatus: 'warning' }, { new: true, runValidators: true });
    // send user and email stating the request has been approved but his account is under warning
  } else {
    // TO DO => req.body.status === 'rejected'
    // send user and email stating the request has been rejected
    return next(appError('This section has not been solved yet!', 405));
  }

  const updatedAppeal = await Appeal.findByIdAndUpdate(req.params.id, {
    status: req.body.status
  });

  res.status(200).json({
    status: 'success',
    data: updatedAppeal
  });
});

exports.deleteAppeal = factory.deleteOne(Appeal);
