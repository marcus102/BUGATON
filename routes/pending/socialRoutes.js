const express = require('express');
const socialController = require('../../controllers/pending/socialController');

const router = express.Router();

router.get('/', socialController.getSocial);

module.exports = router;
