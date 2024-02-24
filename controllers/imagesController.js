const path = require('path');
const fs = require('fs');
const multer = require('multer');
// const User = require('./../models/userModel');
const Image = require('./../models/imagesModel');
const BugReport = require('./../models/bugReportModel');
const BugFixes = require('./../models/bugFixesModel');
const ReusableCode = require('./../models/reusableCodeModel');
const Blog = require('./../models/blogPostModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const appError = require('../utils/appError');

exports.setRequiredIds = (req, res, next) => {
  const setIfUndefined = (field, value) => {
    if (!req.body[field]) req.body[field] = value;
  };
  setIfUndefined('user', req.user.id);
  setIfUndefined('username', req.user.username);
  setIfUndefined('bugReport', req.params.bug_id);
  setIfUndefined('reusableCode', req.params.reusable_code_id);
  setIfUndefined('bugFix', req.params.bug_fixes_id);
  setIfUndefined('blogPost', req.params.blog_post_id);

  next();
};

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const { bugReport, reusableCode, bugFix, blogPost } = req.body;
    let imgDestination = 'profiles';
    if (bugReport || bugFix || reusableCode || blogPost) {
      imgDestination = 'images';
    }

    cb(null, `./../BUGATON/assets/${imgDestination}`);
  },
  filename: function(req, file, cb) {
    // Use the current timestamp as the file name to make it unique
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });
exports.uploadImage = upload.single('image');

exports.checkInfo = catchAsync(async (req, res, next) => {
  const { bugReport, reusableCode, bugFix, blogPost } = req.body;

  let id;
  let DB;

  if (bugFix) {
    id = bugFix;
    DB = BugFixes;
  } else if (reusableCode) {
    id = reusableCode;
    DB = ReusableCode;
  } else if (blogPost) {
    id = blogPost;
    DB = Blog;
  } else if (bugReport) {
    id = bugReport;
    DB = BugReport;
  }

  const targetDoc = await DB.findById(id);

  if (!targetDoc) {
    return next(appError('You cannot perform this action', 405));
  }

  next();
});

// exports.checkUserProfile = catchAsync(async (req, res, next) => {
//   const { user, username } = req.body;
//   const userDoc = await User.findById(user);

//   if (!userDoc && userDoc !== username) {
//     return next(appError('User does not exist!', 405));
//   }

//   next();
// });

exports.createImage = catchAsync(async (req, res, next) => {
  const {
    caption,
    tags,
    likes,
    privacy,
    downloads,
    user,
    username,
    bugReport,
    reusableCode,
    bugFix,
    blogPost
  } = req.body;
  const { mimetype, size } = req.file;

  if (!req.file) {
    return next(appError('No image file provided', 400));
  }

  let updatedUsername = username;
  let imgDirectory = 'profiles';

  if (bugReport || bugFix || reusableCode || blogPost) {
    updatedUsername = null;
    imgDirectory = 'images';
  }

  const newImage = await Image.create({
    imageUrl: path.join(__dirname, '..', 'assets', imgDirectory, req.file.filename),
    caption: caption,
    tags: tags,
    likes: likes,
    privacy: privacy,
    size: size,
    fileFormat: mimetype,
    downloads: downloads,
    user: user,
    username: updatedUsername,
    bugReport: bugReport,
    reusableCode: reusableCode,
    bugFix: bugFix,
    blogPost: blogPost
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

  const { caption, tags, likes, privacy, downloads } = req.body;
  const { size, mimetype, filename } = req.file;

  let imgDirectory = 'profiles';

  if (imageData.username === null) {
    imgDirectory = 'images';
  }

  const oldImagePath = path.join(__dirname, '..', 'assets', imgDirectory, path.basename(imageData.imageUrl));

  await fs.unlink(oldImagePath, err => {
    if (err) throw err;
  });

  imageData.imageUrl = path.join(__dirname, '..', 'assets', 'images', filename);
  imageData.caption = caption || imageData.caption;
  imageData.tags = tags || imageData.tags;
  imageData.likes = likes || imageData.likes;
  imageData.privacy = privacy || imageData.privacy;
  imageData.size = size || imageData.size;
  imageData.fileFormat = mimetype || imageData.fileFormat;
  imageData.downloads = downloads || imageData.downloads;

  await imageData.save({ validateBeforeSave: true });

  res.status(200).json({
    status: 'success',
    data: {
      imageData
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

exports.deletMultipleBugFixesImagesById = factory.deleteManyImages(Image, 'bugFix');

exports.deletMultipleBugReportsImagesById = factory.deleteManyImages(Image, 'bugReport');

exports.deletMultipleBugFixesImagesByArraysOfIds = factory.deleteArrayImages(Image, 'bugFix');

exports.getAllImages = factory.getAll(Image);
exports.getImage = factory.getOne(Image);
