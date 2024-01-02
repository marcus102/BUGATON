const express = require('express');
const bugReportController = require('../controllers/bugReportController');
const bugFixesController = require('../controllers/bugFixesController');
const authenticatioController = require('../controllers/authenticatioController');

const router = express.Router();

router.use('/:bug_id/bug_fixes', bugFixesController);

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

module.exports = router;
