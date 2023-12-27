const express = require('express');
const apiIntegrationsController = require('../controllers/apiIntegrationsController');

const router = express.Router();

router.get('/', apiIntegrationsController.getApi);

module.exports = router;
