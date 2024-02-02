const express = require('express');
const searchController = require('../../controllers/pending/searchController');

const router = express.Router();

router.get('/', searchController.getSearch);

module.exports = router;
