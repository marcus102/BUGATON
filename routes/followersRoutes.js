const express = require('express');
const followersController = require('./../controllers/followersController');
const authenticatioController = require('./../controllers/authenticatioController');
// const userController = require('./../controllers/userController');

const router = express.Router({ mergeParams: true });

router.use(authenticatioController.protect);

router.get(
  '/my_followers',
  followersController.setRequiredIds,
  followersController.getAllFollowersToUsers
);

router.get(
  '/my_followings',
  followersController.setRequiredIds,
  followersController.getAllFollowingsOfUsers
);

router.get(
  '/',
  authenticatioController.restrictTo('admin'),
  followersController.getAllFollowers
);

router.get(
  '/:id',
  authenticatioController.restrictTo('admin'),
  followersController.getFollower
);

router.post(
  '/follow/:followingId',
  followersController.setRequiredIds,
  followersController.follow
);

router.post(
  '/unfollow/:followingId',
  followersController.setRequiredIds,
  followersController.unfollow
);

module.exports = router;
