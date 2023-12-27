const express = require('express');
const reviewsController = require('../controllers/reviewsController');

const router = express.Router();

router.get('/', reviewsController.getReview);

module.exports = router;
