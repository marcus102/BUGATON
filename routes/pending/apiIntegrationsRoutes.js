const express = require('express');
const apiIntegrationsController = require('../../controllers/pending/apiIntegrationsController');

const router = express.Router();

router.get('/', apiIntegrationsController.getApi);

module.exports = router;
