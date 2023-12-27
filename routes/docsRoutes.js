const express = require('express');
const docsController = require('../controllers/docsController');

const router = express.Router();

router.get('/', docsController.getDocs);

module.exports = router;
