const express = require('express');
const collaborationController = require('../../controllers/pending/collaborationController');

const router = express.Router();

router.get('/', collaborationController.getColab);

module.exports = router;
