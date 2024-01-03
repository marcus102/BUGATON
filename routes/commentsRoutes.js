const express = require('express');
const commentsController = require('./../controllers/commentsControllers');
const authenticatioController = require('./../controllers/authenticatioController');

const router = express.Router({ mergeParams: true });

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
