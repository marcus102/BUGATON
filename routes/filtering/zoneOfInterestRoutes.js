const express = require('express');
const zoneOfInterestController = require('./../../controllers/filtering/zoneOfInterestController');
const authenticatioController = require('./../../controllers/authenticatioController');

const router = express.Router({ mergeParams: true });

router.use(authenticatioController.protect);

router
  .route('/')
  .post(
    zoneOfInterestController.setRequiredIds,
    zoneOfInterestController.checkInfo,
    zoneOfInterestController.createZoneOfInterest
  )
  .get(zoneOfInterestController.getAllZoneOfInterests);

router
  .route('/:id')
  .patch(zoneOfInterestController.updateLZoneOfInterest)
  .get(zoneOfInterestController.getZoneOfInterest)
  .delete(zoneOfInterestController.deleteZoneOfInterest);

module.exports = router;
