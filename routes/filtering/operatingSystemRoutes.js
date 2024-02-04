const express = require('express');
const operatingSystemController = require('../../controllers/filtering/operatingSystemController');
const authenticatioController = require('../../controllers/authenticatioController');

const router = express.Router({ mergeParams: true });

router.use(authenticatioController.protect);

router
  .route('/')
  .post(
    operatingSystemController.setRequiredIds,
    operatingSystemController.checkInfo,
    operatingSystemController.createOsPlatform
  )
  .get(operatingSystemController.getAllOsPlatforms);

router
  .route('/:id')
  .patch(operatingSystemController.updateOsPlatform)
  .get(operatingSystemController.getOsPlatform)
  .delete(operatingSystemController.deleteOsPlatform);

module.exports = router;
