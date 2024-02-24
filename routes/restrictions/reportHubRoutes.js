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
  .get(accountReportController.getAllReportedAccounts);

router
  .route('/:id')
  .get(accountReportController.getRepotedAccount)
  .patch(accountReportController.updateReportedAccount)
  .delete(accountReportController.setRequiredIds, accountReportController.deleteAccountReport);

module.exports = router;
