const express = require('express');
const imagesController = require('./../controllers/imagesController');
const authenticatioController = require('./../controllers/authenticatioController');

const router = express.Router({ mergeParams: true });

router.use(authenticatioController.protect);

router.post(
  '/upload_image',
  imagesController.uploadImage,
  imagesController.setRequiredIds,
  authenticatioController.signUp
);

router
  .route('/')
  .get(imagesController.getAllImages)
  .post(
    imagesController.setRequiredIds,
    imagesController.checkInfo,
    imagesController.uploadImage,
    imagesController.setRequiredIds,
    imagesController.createImage
  );

router
  .route('/:id')
  .patch(imagesController.uploadImage, imagesController.setRequiredIds, imagesController.updateImage)
  .delete(imagesController.deleteImage)
  .get(imagesController.getImage);

module.exports = router;
