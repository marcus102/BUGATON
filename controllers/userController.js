const path = require('path');
const fs = require('fs');
const multer = require('multer');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const appError = require('../utils/appError');
const factory = require('./handlerFactory');
const filterParams = require('./../utils/filterParams');

exports.setRequiredIds = (req, res, next) => {
  const setIfUndefined = (field, value) => {
    if (!req.body[field]) req.body[field] = value;
  };
  setIfUndefined('user', req.user.id);
  setIfUndefined('profile', req.file.filename);

  next();
};

// const filterObj = (obj, ...allowedFields) => {
//   const newObj = {};
//   Object.keys(obj).forEach(el => {
//     if (allowedFields.includes(el)) newObj[el] = obj[el];
//   });

//   return newObj;
// };

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './../BUGATON/assets/images');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

exports.uploadImage = upload.single('image');

exports.deleteImage = catchAsync(async (req, res, next) => {
  const imagePath = await User.findById(req.user.id);
  if (!imagePath) {
    return next(appError('Profile not found!', 404));
  }

  if (imagePath.profile === null || !imagePath.profile) {
    return next();
  }

  const oldImagePath = path.join(
    __dirname,
    '..',
    'assets',
    'images',
    path.basename(imagePath.profile)
  );

  await fs.unlink(oldImagePath, err => {
    if (err) throw err;
  });

  next();
});

exports.createUser = catchAsync(async (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'Cannot create a user with this url! Please Sigup'
  });
});

exports.getAllUsers = factory.getAll(User);
exports.deleteUser = factory.deleteOne(User);
exports.updateUser = factory.updateOne(User);
exports.getUser = factory.getOne(User, { path: 'image' });

exports.getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // create error if user post password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(appError('This route is not for password update!', 400));
  }

  const filteredBody = filterParams.allowedFields(
    req.body,
    'firstName',
    'lastName',
    'username',
    'profile',
    'images',
    'email',
    'website',
    'bio',
    'location',
    'zoneOfInterests'
  );

  filteredBody.profile = path.join(
    __dirname,
    '..',
    'assets',
    'images',
    req.body.profile
  );
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null
  });
});
