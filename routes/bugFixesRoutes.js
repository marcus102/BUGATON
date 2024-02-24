const express = require('express');
const commentsRouter = require('./user_engagement/commentsRoutes');
const reviewRouter = require('./user_engagement/reviewsRoutes');
const imageRouter = require('./imagesRoutes');
const likesRouter = require('./user_engagement/likeRoutes');
const reportHubRouter = require('./restrictions/reportHubRoutes');
const commentsController = require('../controllers/user_engagement/commentsControllers');
const authenticatioController = require('../controllers/authenticatioController');
const bugFixesController = require('../controllers/bugFixesController');
const likesController = require('../controllers/user_engagement/likesController');
const imagesController = require('./../controllers/imagesController');
const reviewsController = require('../controllers/user_engagement/reviewsController');

const router = express.Router({ mergeParams: true });

//engagement
router.use('/:bug_fixes_id/comments', commentsRouter);
router.use('/:bug_fixes_id/reviews', reviewRouter);
router.use('/:bug_fixes_id/image', imageRouter);
router.use('/:bug_fixes_id/likes', likesRouter);
//restricitions
router.use('/:bug_fixes_id/report_bug_fix', reportHubRouter);

router.use(authenticatioController.protect);

router.get('/userTotalAttempts', bugFixesController.setRequiredIds, bugFixesController.getUserTotalBugFixes);

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
