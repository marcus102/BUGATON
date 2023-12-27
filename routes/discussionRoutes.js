const express = require('express');
const discussionController = require('../controllers/discussionController');

const router = express.Router();

router.get('/', discussionController.getDsicussion);

module.exports = router;
