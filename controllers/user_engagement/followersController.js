const mongoose = require('mongoose');
const appError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const User = require('../../models/userModel');
const Follower = require('../../models/user_engagement/followersModel');
const factory = require('../handlerFactory');

exports.setRequiredIds = (req, res, next) => {
  const setIfUndefined = (field, value) => {
    if (!req.body[field]) req.body[field] = value;
  };
  setIfUndefined('followerId', req.user.id);
  next();
};

exports.follow = catchAsync(async (req, res, next) => {
  const { followerId } = req.body;
  const { followingId } = req.params;

  const followerExists = await User.exists({ _id: followerId });
  if (!followerExists) {
    return next(appError('Follower not found.', 404));
  }

  const followingUserExists = await User.exists({ _id: followingId });
  if (!followingUserExists) {
    return next(appError('User being followed not found.', 404));
  }

  const existingFollow = await Follower.findOne({ followerId, followingId });
  if (existingFollow) {
    return next(appError('Already following this user.', 400));
  }

  const newFollower = await Follower.create({
    followerId,
    followingId
  });

  await User.findByIdAndUpdate(followerId, { $inc: { followingCount: 1 } });
  await User.findByIdAndUpdate(followingId, { $inc: { followersCount: 1 } });

  return res.status(200).json({
    status: 'success',
    message: 'User followed successfully.',
    data: newFollower
  });
});

exports.unfollow = catchAsync(async (req, res, next) => {
  const { followerId } = req.body;
  const { followingId } = req.params;

  const followerExists = await User.exists({ _id: followerId });
  if (!followerExists) {
    return next(appError('Follower user not found.', 404));
  }

  const followingUserExists = await User.exists({ _id: followingId });
  if (!followingUserExists) {
    return next(appError('User being followed not found.', 404));
  }

  const existingFollow = await Follower.findOneAndDelete({
    followerId,
    followingId
  });
  if (!existingFollow) {
    return next(appError('Not following this user.', 400));
  }

  await User.findByIdAndUpdate(followerId, { $inc: { followingCount: -1 } });
  await User.findByIdAndUpdate(followingId, { $inc: { followersCount: -1 } });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getAllFollowers = factory.getAll(Follower);
exports.getFollower = factory.getOne(Follower);

exports.getAllFollowersToUsers = catchAsync(async (req, res, next) => {
  const { followerId } = req.body;

  const result = await Follower.aggregate([
    {
      $match: { followingId: new mongoose.Types.ObjectId(followerId) }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'followerId',
        foreignField: '_id',
        as: 'follower'
      }
    },
    {
      $unwind: '$follower'
    },
    {
      $project: {
        followerId: '$follower._id',
        username: '$follower.username',
        profile: '$follower.profile',
        timestamp: '$timestamp'
      }
    }
  ]);

  if (result.length === 0) {
    return next(appError('You do not have any follower', 404));
  }

  res.status(200).json({
    status: 'success',
    data: result
  });
});

exports.getAllFollowingsOfUsers = catchAsync(async (req, res, next) => {
  const { followerId } = req.body;

  const result = await Follower.aggregate([
    {
      $match: { followerId: new mongoose.Types.ObjectId(followerId) }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'followingId',
        foreignField: '_id',
        as: 'following'
      }
    },
    {
      $unwind: '$following'
    },
    {
      $project: {
        followingId: '$following._id',
        username: '$following.username',
        profile: '$following.profile',
        timestamp: 1
      }
    }
  ]);

  if (result.length === 0) {
    return next(appError('You do not follow anyone', 404));
  }

  res.status(200).json({
    status: 'success',
    data: result
  });
});
