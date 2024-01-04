const express = require('express');
const reusableCodeControllerjs = require('./../controllers/reusableCodeControllerjs');
const authenticatioController = require('./../controllers/authenticatioController');
const imageRouter = require('./../routes/imagesRoutes');

const router = express.Router({ mergeParams: true });

router.use('/:reusable_code_id', imageRouter);

router.use(authenticatioController.protect);

router
  .route('/')
  .get(reusableCodeControllerjs.getAllReviews)
  .post(
    authenticatioController.restrictTo('user'),
    reusableCodeControllerjs.setRequiredIds,
    reusableCodeControllerjs.createReview
  );
router
  .route('/:id')
  .get(reusableCodeControllerjs.getReview)
  .patch(
    authenticatioController.restrictTo('user', 'admin'),
    reusableCodeControllerjs.updateReview
  )
  .delete(
    authenticatioController.restrictTo('user', 'admin'),
    reusableCodeControllerjs.deleteReview
  );

module.exports = router;
