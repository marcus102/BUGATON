const express = require('express');
const commentsController = require('../../controllers/user_engagement/commentsControllers');
const authenticatioController = require('../../controllers/authenticatioController');
const reportHubRouter = require('./../restrictions/reportHubRoutes');

const router = express.Router({ mergeParams: true });

//restrictions
router.use('/:comment_id/report_comment', reportHubRouter);

router.use(authenticatioController.protect);

router
  .route('/')
  .get(commentsController.getAllComments)
  .post(commentsController.setRequiredIds, commentsController.createComment);
router
  .route('/:id')
  .post(commentsController.setRequiredIds, commentsController.createComment)
  .get(commentsController.setRequiredIds, commentsController.getComment)
  .patch(commentsController.updateComment)
  .delete(commentsController.deleteComment);

module.exports = router;
