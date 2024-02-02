const express = require('express');
const trainingController = require('../../controllers/pending/trainingController');

const router = express.Router();

router.get('/', trainingController.getTraining);

module.exports = router;
