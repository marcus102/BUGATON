const express = require('express');
const commentsController = require('../controllers/commentsControllers');

const router = express.Router();

router.get('/', commentsController.getComment);

module.exports = router;
