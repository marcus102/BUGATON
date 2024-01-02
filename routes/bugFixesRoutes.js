const express = require('express');
const bugFixesController = require('../controllers/bugFixesController');
const authenticatioController = require('../controllers/authenticatioController');

const router = express.Router({ mergeParams: true });

router.use(authenticatioController.protect);

router
  .route('/')
  .get(bugFixesController.getALLBugFixes)
  .post(bugFixesController.createBugFix);

router
  .route('/:id')
  .get(bugFixesController.getBugFix)
  .patch(bugFixesController.updateBugFix)
  .delete(bugFixesController.deleteBugFix);

module.exports = router;
