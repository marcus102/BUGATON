const express = require('express');
const reviewController = require('../../controllers/user_engagement/reviewsController');
const authenticatioController = require('../../controllers/authenticatioController');

const router = express.Router({ mergeParams: true });

router.use(authenticatioController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authenticatioController.restrictTo('user', 'admin'),
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
