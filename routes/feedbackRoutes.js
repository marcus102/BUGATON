const express = require('express');
const feedbackController = require('./../controllers/feedbackController');
const authenticatioController = require('./../controllers/authenticatioController');

const router = express.Router({ mergeParams: true });

router.use(authenticatioController.protect);

router
  .route('/')
  .get(
    authenticatioController.restrictTo('admin'),
    feedbackController.getAllFeedbacks
  )
  .post(feedbackController.setRequiredIds, feedbackController.createFeedback);

router
  .route('/:id')
  .get(
    authenticatioController.restrictTo('admin'),
    feedbackController.getFeedback
  )
  .patch(
    authenticatioController.restrictTo('admin'),
    feedbackController.updateFeedback
  )
  .delete(
    authenticatioController.restrictTo('admin'),
    feedbackController.deleteFeedback
  );

module.exports = router;
