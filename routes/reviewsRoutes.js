const express = require('express');
const reviewController = require('./../controllers/reviewsController');
const authenticatioController = require('./../controllers/authenticatioController');
const imageRouter = require('./../routes/imagesRoutes');

const router = express.Router({ mergeParams: true });
router.use('/:review_id', imageRouter);

router.use(authenticatioController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authenticatioController.restrictTo('user'),
    reviewController.setRequiredIds,
    reviewController.createReview
  );
router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authenticatioController.restrictTo('user', 'admin'),
    reviewController.updateReview
  )
  .delete(
    authenticatioController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  );

module.exports = router;
