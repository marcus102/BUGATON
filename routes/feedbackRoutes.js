const express = require('express');
const feedbackController = require('./../controllers/feedbackController');
const authenticatioController = require('./../controllers/authenticatioController');

const router = express.Router({ mergeParams: true });

router.use(authenticatioController.protect);

router
  .route('/')
  .get(feedbackController.getAllFeedbacks)
  .post(
    authenticatioController.restrictTo('user'),
    feedbackController.setRequiredIds,
    feedbackController.createFeedback
  );
router
  .route('/:id')
  .get(feedbackController.getFeedback)
  .patch(
    authenticatioController.restrictTo('user', 'admin'),
    feedbackController.updateFeedback
  )
  .delete(
    authenticatioController.restrictTo('user', 'admin'),
    feedbackController.deleteFeedback
  );

module.exports = router;
