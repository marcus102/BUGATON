const express = require('express');
const bugReportController = require('../controllers/bugReportController');
const commentsRouter = require('./commentsRoutes');
const commentsController = require('./../controllers/commentsControllers');
const imageRouter = require('./imagesRoutes');
const imagesController = require('./../controllers/imagesController');
const likesController = require('./../controllers/likesController');
const authenticatioController = require('../controllers/authenticatioController');
const bugFixRouter = require('./bugFixesRoutes');
const bugFixesController = require('../controllers/bugFixesController');
const contributorsController = require('./../controllers/contributorsController');

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
    commentsController.deleteMultipleBugFixesCommentsById,
    commentsController.deleteMultipleBugReportsCommentsById,
    likesController.deleteMultiplebugFixesLikesById,
    likesController.deleteMultiplebugReportsLikesById,
    imagesController.deletMultipleBugFixesImagesById,
    imagesController.deletMultipleBugReportsImagesById,
    contributorsController.deleteMultipleContributionsById,
    bugFixesController.deleteMultipleBugFixesById,
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
