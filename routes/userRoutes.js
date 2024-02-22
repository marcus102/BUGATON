const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('../controllers/authenticatioController');
const followersRouter = require('./user_engagement/followersRoutes');
const imageController = require('./../controllers/imagesController');

const router = express.Router({ mergeParams: true });

router.post('/signup', authController.signUp);
router.post('/login', authController.logIn);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);

router.use('/my-followers', followersRouter);

router.patch(
  '/profile',
  imageController.setRequiredIds,
  imageController.uploadImage,
  imageController.setRequiredIds,
  imageController.updateImage
);
router.post(
  '/profile',
  imageController.setRequiredIds,
  imageController.uploadImage,
  imageController.setRequiredIds,
  imageController.createImage
);
router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
