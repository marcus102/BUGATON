const express = require('express');
const bugReportController = require('../controllers/bugReportController');
const bugFixesController = require('../controllers/bugFixesController');
const authenticatioController = require('../controllers/authenticatioController');

const router = express.Router();

router.use(authenticatioController.protect);

router
  .route('/')
  .get(bugReportController.getAllBugs)
  .post(bugReportController.createBug);

router
  .route('/:id')
  .get(bugReportController.getBug)
  .patch(bugReportController.updateBug)
  .delete(bugReportController.deleteBug);

router
  .route('/:id/bug_fix')
  .get(bugFixesController.getALLBugFixes)
  .post(bugFixesController.createBugFix);

router
  .route('/:id/bug_fix/:bug_fix_id')
  .get(bugFixesController.getBugFix)
  .patch(bugFixesController.updateBugFix)
  .delete(bugFixesController.deleteBugFix);

module.exports = router;
