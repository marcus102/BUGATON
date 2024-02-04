const express = require('express');
const programmingLanguagesController = require('./../../controllers/filtering/programmingLanguagesController');
const authenticatioController = require('./../../controllers/authenticatioController');

const router = express.Router({ mergeParams: true });

router.use(authenticatioController.protect);

router
  .route('/')
  .post(
    programmingLanguagesController.setRequiredIds,
    programmingLanguagesController.checkInfo,
    programmingLanguagesController.createLanguage
  )
  .get(programmingLanguagesController.getAllLanguages);

router
  .route('/:id')
  .patch(programmingLanguagesController.updateLanguage)
  .get(programmingLanguagesController.getLanguage)
  .delete(programmingLanguagesController.deleteLanguage);

module.exports = router;
