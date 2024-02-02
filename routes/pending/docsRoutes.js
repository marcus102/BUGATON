const express = require('express');
const docsController = require('../../controllers/pending/docsController');

const router = express.Router();

router.get('/', docsController.getDocs);

module.exports = router;
