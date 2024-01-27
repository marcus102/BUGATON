const path = require('path');
const fs = require('fs');
const multer = require('multer');
const Image = require('./../models/imagesModel');
const BugReport = require('./../models/bugReportModel');
const UserAttempt = require('./../models/bugFixesModel');
const ReusableCode = require('./../models/reusableCodeModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const appError = require('../utils/appError');

exports.setRequiredIds = (req, res, next) => {
  const setIfUndefined = (field, value) => {
    if (!req.body[field]) req.body[field] = value;
  };
  setIfUndefined('user', req.user.id);
  setIfUndefined('bugReport', req.params.bug_id);
  setIfUndefined('reusableCode', req.params.reusable_code_id);
  setIfUndefined('bugFix', req.params.bug_fixes_id);

  next();
};

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

exports.checkInfo = catchAsync(async (req, res, next) => {
  const { bugReport, reusableCode, bugFix } = req.body;

  const bugReportDoc = await BugReport.findById(bugReport);
  const bugFixDoc = await UserAttempt.findById(bugFix);
  const reusableCodeDoc = await ReusableCode.findById(reusableCode);

  if (!(bugReportDoc || bugFixDoc || reusableCodeDoc)) {
    return next(appError('You cannot perform this action', 405));
  }

  next();
});

exports.uploadImage = upload.single('image');

exports.createImage = catchAsync(async (req, res, next) => {
  const {
    caption,
    tags,
    likes,
    privacy,
    downloads,
    user,
    bugReport,
    reusableCode,
    bugFix
  } = req.body;
  const { mimetype, size } = req.file;

  if (!req.file) {
    return next(appError('No image file provided', 400));
  }

  const newImage = await Image.create({
    imageUrl: path.join(__dirname, '..', 'assets', 'images', req.file.filename),
    caption: caption,
    tags: tags,
    likes: likes,
    privacy: privacy,
    size: size,
    fileFormat: mimetype,
    downloads: downloads,
    user: user,
    bugReport: bugReport,
    reusableCode: reusableCode,
    bugFix: bugFix
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

  await Image.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.deletMultipleBugFixesImagesById = factory.deleteManyImages(
  Image,
  'bugFix'
);

exports.deletMultipleBugReportsImagesById = factory.deleteManyImages(
  Image,
  'bugReport'
);

exports.getAllImages = factory.getAll(Image);
exports.getImage = factory.getOne(Image);
