const express = require('express');
const imagesController = require('./../controllers/imagesController');
const authenticatioController = require('./../controllers/authenticatioController');

const router = express.Router({ mergeParams: true });

router.use(authenticatioController.protect);

router
  .route('/')
  .get(imagesController.getAllImages)
  .post(
    imagesController.uploadImage,
    imagesController.setRequiredIds,
    imagesController.createImage
  );

router
  .route('/:id')
  .patch(
    imagesController.uploadImage,
    imagesController.setRequiredIds,
    imagesController.updateImage
  )
  .delete(imagesController.deleteImage)
  .get(imagesController.getImage);

module.exports = router;
