const express = require('express');
const bugReportController = require('../controllers/bugReportController');
const commentsRouter = require('./../routes/commentsRoutes');
const reviewRouter = require('./../routes/reviewsRoutes');
const imageRouter = require('./../routes/imagesRoutes');
const authenticatioController = require('../controllers/authenticatioController');
const bugFixesController = require('../controllers/bugFixesController');

const router = express.Router();

router.use('/:bug_id/comments', commentsRouter);
router.use('/:bug_id/bug_fixes/:bug_fixes_id/comments', commentsRouter);
router.use('/:bug_id/bug_fixes/:bug_fixes_id/reviews', reviewRouter);
router.use('/:bug_id', imageRouter);
router.use('/:bug_id/bug_fixes/bug_fixes_id/', imageRouter);

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

router
  .route('/:bug_id/bug_fixes')
  .get(bugFixesController.getALLBugFixes)
  .post(bugFixesController.setRequiredIds, bugFixesController.createBugFix);

router
  .route('/:bug_id/bug_fixes/:id')
  .get(bugFixesController.getBugFix)
  .patch(bugFixesController.updateBugFix)
  .delete(bugFixesController.deleteBugFix);

module.exports = router;
