const express = require('express');
const commentsRouter = require('./commentsRoutes');
const commentsController = require('./../controllers/commentsControllers');
const reviewRouter = require('./reviewsRoutes');
const imageRouter = require('./imagesRoutes');
const likesRouter = require('./likeRoutes');
const authenticatioController = require('../controllers/authenticatioController');
const bugFixesController = require('../controllers/bugFixesController');
const likesController = require('./../controllers/likesController');
const imagesController = require('./../controllers/imagesController');
const reviewsController = require('./../controllers/reviewsController');

const router = express.Router({ mergeParams: true });

router.use('/:bug_fixes_id/comments', commentsRouter);
router.use('/:bug_fixes_id/reviews', reviewRouter);
router.use('/:bug_fixes_id/image', imageRouter);
router.use('/:bug_fixes_id/likes', likesRouter);

router.use(authenticatioController.protect);

router.get(
  '/userTotalAttempts',
  bugFixesController.setRequiredIds,
  bugFixesController.getUserTotalBugFixes
);

router
  .route('/')
  .get(bugFixesController.getALLBugFixes)
  .post(bugFixesController.setRequiredIds, bugFixesController.createBugFix);

router
  .route('/:id')
  .post(bugFixesController.setRequiredIds, bugFixesController.createBugFix)
  .get(bugFixesController.getBugFix)
  .patch(bugFixesController.updateBugFix)
  .delete(
    commentsController.deleteMultipleBugFixesCommentsById,
    reviewsController.deleteMultiplebugFixesReviewsById,
    likesController.deleteMultiplebugFixesLikesById,
    imagesController.deletMultipleBugFixesImagesById,
    bugFixesController.deleteBugFix
  );

module.exports = router;
