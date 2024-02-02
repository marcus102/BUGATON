const express = require('express');
const contributorsController = require('../../controllers/user_engagement/contributorsController');
const authenticatioController = require('../../controllers/authenticatioController');

const router = express.Router({ mergeParams: true });

router.use(authenticatioController.protect);

router
  .route('/')
  .get(contributorsController.getAllContributions)
  .post(contributorsController.createContribution);

router.route('/:id').get(contributorsController.getContribution);

module.exports = router;
