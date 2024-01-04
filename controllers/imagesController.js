const path = require('path');
const fs = require('fs');
const multer = require('multer'); // For handling file uploads
const Image = require('./../models/imagesModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const appError = require('../utils/appError');

exports.setRequiredIds = (req, res, next) => {
  const setIfUndefined = (field, value) => {
    if (!req.body[field]) req.body[field] = value;
  };
  setIfUndefined('user', req.user.id);

  next();
};

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './../BUGATON/assets/images'); // Specify the destination folder
  },
  filename: function(req, file, cb) {
    // Use the current timestamp as the file name to make it unique
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Handle POST request to upload an image
exports.uploadImage = upload.single('image');

exports.createImage = catchAsync(async (req, res, next) => {
  // Check if an image file was provided in the request
  if (!req.file) {
    return next(appError('No image file provided', 400));
  }
  // Create a new Image document
  const newImage = await Image.create({
    user: req.body.user,
    caption: req.body.caption,
    imageUrl: path.join(__dirname, '..', 'assets', 'images', req.file.filename),
    tags: req.body.tags,
    likes: req.body.likes,
    privacy: req.body.privacy,
    size: req.file.size,
    fileFormat: req.file.mimetype,
    downloads: req.body.downloads
  });

  res.status(201).json({
    status: 'success',
    data: {
      newImage
    }
  });
});

exports.updateImage = catchAsync(async (req, res, next) => {
  const imageData = await Image.findById(req.params.id);
  if (!imageData) {
    return next(appError('Image not found', 404));
  }

  if (!req.file) {
    return next(appError('No new image file provided for update', 400));
  }

  const oldImagePath = path.join(
    __dirname,
    '..',
    'assets',
    'images',
    path.basename(imageData.imageUrl)
  );

  await fs.unlink(oldImagePath, err => {
    if (err) throw err;
  });

  imageData.imageUrl = path.join(
    __dirname,
    '..',
    'assets',
    'images',
    req.file.filename
  );
  imageData.caption = req.body.caption || imageData.caption;
  imageData.tags = req.body.tags || imageData.tags;
  imageData.likes = req.body.likes || imageData.likes;
  imageData.privacy = req.body.privacy || imageData.privacy;
  imageData.size = req.file.size || imageData.size;
  imageData.fileFormat = req.file.mimetype || imageData.fileFormat;
  imageData.downloads = req.body.downloads || imageData.downloads;

  await imageData.save({ validateBeforeSave: true });

  res.status(200).json({
    status: 'success',
    data: {
      image: imageData
    }
  });
});

exports.deleteImage = catchAsync(async (req, res, next) => {
  const image = await Image.findById(req.params.id);

  if (!image) {
    return next(appError('Image not found', 404));
  }

  await fs.unlink(image.imageUrl, err => {
    if (err) throw err;
  });

  factory.deleteOne(Image);

  //   await Image.findByIdAndDelete(req.params.id);

  //   res.status(204).json({
  //     status: 'success',
  //     data: null
  //   });
});

exports.getAllImages = factory.getAll(Image);
// exports.createImage2 = factory.createOne(Image);
exports.getImage = factory.getOne(Image);
// exports.updateImage2 = factory.updateOne(Image);
