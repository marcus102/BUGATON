const express = require('express');
const bughandlerController = require('../controllers/bugHandlerController');

const router = express.Router();

router.get('/', bughandlerController.getbug);

module.exports = router;
