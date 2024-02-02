const express = require('express');
const eventController = require('../../controllers/pending/eventController');

const router = express.Router();

router.get('/', eventController.getEvent);

module.exports = router;
