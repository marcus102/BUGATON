const express = require('express');
const bugReportController = require('../controllers/bugReportController');
const commentsRouter = require('./commentsRoutes');
const imageRouter = require('./imagesRoutes');
const authenticatioController = require('../controllers/authenticatioController');
const bugFixRouter = require('./bugFixesRoutes');

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
  .delete(bugReportController.deleteBug);

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
