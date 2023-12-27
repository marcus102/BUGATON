const express = require('express');
const bugReportController = require('../controllers/bugReportController');
const bugFixesController = require('../controllers/bugFixesController');

const router = express.Router();

router.get('/question', bugReportController.getbug);
router.get('/answer', bugFixesController.getbugFixes);
router.get('/comment', bugFixesController.getbugFixes);

module.exports = router;
