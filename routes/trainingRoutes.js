const express = require('express');
const trainingController = require('../controllers/trainingController');

const router = express.Router();

router.get('/', trainingController.getTraining);

module.exports = router;
