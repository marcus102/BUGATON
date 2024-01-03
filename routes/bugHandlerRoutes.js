const express = require('express');
const bugReportController = require('../controllers/bugReportController');
// const bugFixesRouter = require('./../routes/bugFixesRoutes');
const authenticatioController = require('../controllers/authenticatioController');
const bugFixesController = require('../controllers/bugFixesController');

const router = express.Router();

// router.use('/:bug_id/bug_fixes', bugFixesRouter);

router.use(authenticatioController.protect);
router
  .route('/')
  .get(bugReportController.getAllBugs)
  .post(bugReportController.setBugUserIds, bugReportController.createBug);

router
  .route('/:id')
  .get(bugReportController.getBug)
  .patch(bugReportController.updateBug)
  .delete(bugReportController.deleteBug);

router
  .route('/:bug_id/bug_fixes')
  .get(bugFixesController.getALLBugFixes)
  .post(bugFixesController.setBugUserIds, bugFixesController.createBugFix);

router
  .route('/:bug_id/bug_fixes/:id')
  .get(bugFixesController.getBugFix)
  .patch(bugFixesController.updateBugFix)
  .delete(bugFixesController.deleteBugFix);

module.exports = router;
