const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'User must have a first name!']
  },
  lastName: {
    type: String,
    required: [true, 'User must have a last name!']
  },
  username: {
    type: String,
    required: [true, 'User must have a username!'],
    unique: [
      true,
      'Sorry, the username is already in use. Please choose another one!'
    ],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'User must have an email address!'],
    unique: [true, 'Sorry email already exist!! try another one!'],
    trim: true,
    lowercase: true,
    validate: {
      validator: validator.isEmail,
      message: 'Please provide a valid email!'
    }
  },
  profile: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: [
      'user',
      'moderator',
      'developer',
      'tester',
      'support',
      'analyst',
      'content_creator',
      'educator:',
      'collaborator',
      'superuser',
      'admin'
    ],
    default: 'user'
  },
  website: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    default: null
  },
  location: {
    type: String,
    default: null
  },
  password: {
    type: String,
    required: [true, 'User must have a password!'],
    minlength: [8, 'Your password must have a minimum of 8 characters!'],
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'User must have a password!'],
    validate: {
      //only works on CREATE and SAVE
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords are differents!'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  },
  passwordChangedAt: {
    type: Date,
    default: Date.now
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimeStamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
