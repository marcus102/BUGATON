const express = require('express');
const bugReportController = require('../controllers/bugReportController');
const commentsRouter = require('./commentsRoutes');
// const reviewRouter = require('./../routes/reviewsRoutes');
const imageRouter = require('./imagesRoutes');
const authenticatioController = require('../controllers/authenticatioController');
// const bugFixesController = require('../controllers/bugFixesController');
const bugFixRouter = require('./bugFixesRoutes');

const router = express.Router({ mergeParams: true });

router.use('/:bug_id/comments', commentsRouter);
// router.use('/:bug_id/bug_fixes/:bug_fixes_id/comments', commentsRouter);
// router.use('/:bug_id/bug_fixes/:bug_fixes_id/reviews', reviewRouter);
router.use('/:bug_id/image', imageRouter);
// router.use('/:bug_report_id/bug_fixes/:bug_fixes_id/image', imageRouter);
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

module.exports = router;
