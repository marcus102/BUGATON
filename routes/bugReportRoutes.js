const express = require('express');
const commentsRouter = require('./commentsRoutes');
const imageRouter = require('./imagesRoutes');
const bugFixRouter = require('./bugFixesRoutes');
const bugFixesController = require('../controllers/bugFixesController');
const contributorsController = require('./../controllers/contributorsController');
const imagesController = require('./../controllers/imagesController');
const likesController = require('./../controllers/likesController');
const authenticatioController = require('../controllers/authenticatioController');
const commentsController = require('./../controllers/commentsControllers');
const bugReportController = require('../controllers/bugReportController');
const reviewsController = require('./../controllers/reviewsController');

const router = express.Router({ mergeParams: true });

router.use('/:bug_id/comments', commentsRouter);
router.use('/:bug_id/image', imageRouter);
router.use('/:bug_id/bug_fix', bugFixRouter);

router.use(authenticatioController.protect);

router
  .route('/')
  .get(bugReportController.getAllBugs)
  .post(bugReportController.setRequiredIds, bugReportController.createBug);

router
  .route('/:id')
  .get(bugReportController.getBug)
  .patch(bugReportController.updateBug)
  .delete(
    commentsController.deleteMultipleBugReportsCommentsById,
    imagesController.deletMultipleBugReportsImagesById,
    contributorsController.deleteMultipleContributionsById,
    bugFixesController.deleteMultipleBugFixesById,
    commentsController.deleteMultipleBugFixesCommentsByArraysOfIds,
    likesController.deleteMultiplebugFixesLikesByArraysOfIds,
    imagesController.deletMultipleBugFixesImagesByArraysOfIds,
    reviewsController.deleteMultiplebugFixesReviewsByArrayOfIds,
    bugReportController.deleteBug
  );

router.patch(
  '/:id/assignBugTo/:assigneeId',
  bugReportController.setRequiredIds,
  bugReportController.assignBugToUser
);

router.patch(
  '/:id/deassignBugTo/:assigneeId',
  bugReportController.setRequiredIds,
  bugReportController.deassignBugFromUser
);

module.exports = router;
