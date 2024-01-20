const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('../utils/catchAsync');
const appError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    // secure: true,
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: user
    }
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt
  });

  createAndSendToken(newUser, 201, res);
});

exports.logIn = catchAsync(async (req, res, next) => {
  const { email, username, password } = req.body;
  // check if email or username and password exist
  if (!((email || username) && password)) {
    return next(
      appError(
        'Please provide a valid username or email address and a password!',
        400
      )
    );
  }
  // check if user exists && password is correct
  const user = await User.findOne({ $or: [{ email }, { username }] }).select(
    '+password'
  );

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(appError('Incorrect credentials!', 401));
  }
  // check if everything is ok and send token to client
  createAndSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // get token availability
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      appError('You are not loged in! Please log in to get access', 401)
    );
  }
  // validate the token (verification)
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // check if user still exist
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      appError('The user belonging to this token does no loger exist.', 401)
    );
  }

  // check if user change password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      appError('User recently changed password! Please login again!', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        appError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

exports.actionStatus = (...status) => {
  return (req, res, next) => {
    if (!status.includes(req.user.role)) {
      return next(
        appError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // get user based on post request
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(appError('There is no user with that email address', 404));
  }
  // generate random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // send it to user email

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password?\n Submit a PATCH request with your new password to: ${resetURL}.\nIf you didn't forget your password, please ignore this email`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (Valid for 10min).',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      appError(
        'there was an error sending this email, please try again later!',
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // get user based on the token
  const hasdedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hasdedToken,
    passwordResetExpires: { $gte: Date.now() }
  });
  // set tne new password if token has not expired and user still exist

  if (!user) {
    return next(appError('Your token has expired!', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  // update changedPasswordAt property for the user
  // send the user in by sending the JSWT (token) to the client
  createAndSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // get user from collection
  const { passwordCurent, password, passwordConfirm } = req.body;
  const user = await User.findById(req.user.id).select('+password');
  // check if password is correct
  if (!(await user.correctPassword(passwordCurent, user.password))) {
    return next(appError('Your current password is wrong!', 401));
  }

  // update the password

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.save();
  // log back the user in by sending back token
  createAndSendToken(user, 200, res);
});
