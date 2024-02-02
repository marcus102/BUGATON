const express = require('express');
const reusableCodeController = require('./../controllers/reusableCodeControllerjs');
const authenticatioController = require('./../controllers/authenticatioController');
const imageRouter = require('./imagesRoutes');
const commentRouter = require('./user_engagement/commentsRoutes');
const likesRouter = require('./user_engagement/likeRoutes');

const router = express.Router({ mergeParams: true });

router.use('/:reusable_code_id/image', imageRouter);
router.use('/:reusable_code_id/comments', commentRouter);
router.use('/:reusable_code_id/likes', likesRouter);

router.use(authenticatioController.protect);

router
  .route('/')
  .get(reusableCodeController.getAllReusableCodes)
  .post(
    reusableCodeController.setRequiredIds,
    reusableCodeController.createReusableCode
  );
router
  .route('/:id')
  .get(reusableCodeController.getReusableCode)
  .patch(reusableCodeController.updateReusableCode)
  .delete(reusableCodeController.deleteReusableCode);

module.exports = router;
