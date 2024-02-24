const express = require('express');
const accountReportController = require('../../controllers/restrictions/reportHubController');
const authenticatioController = require('../../controllers/authenticatioController');

const router = express.Router({ mergeParams: true });

router.use(authenticatioController.protect);

router
  .route('/')
  .post(
    accountReportController.setRequiredIds,
    accountReportController.checkInfo,
    accountReportController.setRequiredIds,
    accountReportController.reportAccount
  )
  .get(accountReportController.getAllReportedAccounts)
  .get(accountReportController.getRepotedAccount);

router
  .route('/:id')
  .patch(accountReportController.updateReportedAccount)
  .delete(accountReportController.deleteAccountReport);

module.exports = router;
