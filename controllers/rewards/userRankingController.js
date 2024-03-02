const UserRanking = require('./../../models/rewards/userRankingModel');
const User = require('./../../models/userModel');
const catchAsync = require('../../utils/catchAsync');
const appError = require('../../utils/appError');
// const factory = require('../handlerFactory');

exports.createRanking = catchAsync(async (req, res, next) => {
  //get the currently created user
  const targetUser = await User.findById(req.newUser.id);

  if (!targetUser) {
    return next(appError('User not found!', 405));
  }

  const { _id } = targetUser;

  const ranking = new UserRanking({
    description:
      'Users who are new to the website or community, with limited activity, experience, or problem-solving contributions.',
    earned: true,
    user: _id
  });

  await ranking.save();

  next();
});

exports.updateRanking = catchAsync(async (req, res, next) => {
  const targetRanking = await UserRanking.findByIdAndUpdate(req.params.ranking_id, {
    ranking: 'advance',
    challengesCompleted: 3
  });

  if (!targetRanking) {
    return next(appError('Doc under this ID not found!', 405));
  }
});
