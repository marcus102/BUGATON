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
exports.unblockedUserHandler = factory.deleteOne(BlockedUser);
