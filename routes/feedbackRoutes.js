const express = require('express');
const feedbackController = require('../controllers/feedbackController');

const router = express.Router();

router.get('/', feedbackController.getFeeds);

module.exports = router;
