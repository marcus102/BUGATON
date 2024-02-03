const express = require('express');
const categoriesController = require('./../../controllers/filtering/categoriesController');
const authenticatioController = require('./../../controllers/authenticatioController');

const router = express.Router({ mergeParams: true });

router.use(authenticatioController.protect);

router
  .route('/')
  .post(
    categoriesController.setRequiredIds,
    categoriesController.checkInfo,
    categoriesController.createCategory
  )
  .get(categoriesController.getAllCategories);

router
  .route('/:id')
  .get(categoriesController.getCategory)
  .patch(categoriesController.updateCategory)
  .delete(categoriesController.deleteCategory);

module.exports = router;
