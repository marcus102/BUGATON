const User = require('./../../models/userModel');
const BlockedUser = require('./../../models/restrictions/blockedUserModel');
const catchAsync = require('../../utils/catchAsync');
const appError = require('../../utils/appError');
const factory = require('../handlerFactory');

exports.blockUserHandler = catchAsync(async (req, res, next) => {
  const targetUser = await User.findById(req.params.account_id);

  if (!targetUser) {
    return next(appError('The user you are trying to block does not exist!', 405));
  }

  const isTargetUserUserBlocked = await BlockedUser.findOne({
    blockedBy: req.user.id,
    blockedUser: req.params.account_id
  });

  if (isTargetUserUserBlocked) {
    return next(appError('You have already blocked this user!', 405));
  }

  const newBlockedUser = new BlockedUser({
    blockedBy: req.user.id,
    blockedUser: req.params.account_id,
    reason: req.body.reason
  });

  await newBlockedUser.save();

  res.status(201).json({
    status: 'success',
    data: newBlockedUser
  });
});

exports.getAllBlockedUsers = factory.getAll(BlockedUser);
exports.getBlockedUser = factory.getOne(BlockedUser);
exports.updateBlockedUser = factory.updateOne(BlockedUser);

exports.unblockedUserHandler = catchAsync(async (req, res, next) => {
  const blockedUserDoc = await BlockedUser.findById(req.params.id);

  if (!blockedUserDoc) {
    return next(appError('Document with that ID does not exist!', 405));
  }

  const { blockedBy } = blockedUserDoc;

  if (!blockedBy.valueOf() === req.user.id) {
    return next(appError('You cannot unblock a user that you have not blocked!', 401));
  }

  await BlockedUser.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: 'success',
    data: null
  });
});
