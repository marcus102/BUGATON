const express = require('express');
const authenticatioController = require('../../controllers/authenticatioController');
const appealHubController = require('./../../controllers/restrictions/appealHubController');

const router = express.Router({ mergeParams: true });

router.use(authenticatioController.protect);

router
  .route('/')
  .post(appealHubController.makeAnAppeal)
  .get(authenticatioController.restrictTo('admin'), appealHubController.getAllAppeals);

router.use(authenticatioController.restrictTo('admin'));

router
  .route('/:id')
  .get(appealHubController.getAppeal)
  .patch(appealHubController.updateAppeal)
  .delete(appealHubController.deleteAppeal);

module.exports = router;
