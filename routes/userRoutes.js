const express = require('express');
const userController = require('./../controllers/userController');
const authenticatioController = require('../controllers/authenticatioController');
const followersRouter = require('./user_engagement/followersRoutes');
const reportHubRouter = require('./restrictions/reportHubRoutes');
const imageController = require('./../controllers/imagesController');

const router = express.Router({ mergeParams: true });

router.post('/signup', authenticatioController.signUp);
router.post('/login', authenticatioController.logIn);
router.post('/forgotPassword', authenticatioController.forgotPassword);
router.patch('/resetPassword/:token', authenticatioController.resetPassword);

router.use('/my-followers', followersRouter);
router.use('/:account_id/report_account', reportHubRouter);

router.use(authenticatioController.protect);

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
router.patch('/updateMyPassword', authenticatioController.updatePassword);
router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

router.use(authenticatioController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

router.patch('/:user_id/assign_role', userController.setRequiredIds, userController.assignUserRole);
module.exports = router;
