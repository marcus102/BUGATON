// const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
// const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'A user must have a first name!']
  },
  lastName: {
    type: String,
    required: [true, 'A user must have a last name!']
  },
  username: {
    type: String,
    required: [true, 'A user must have a username!'],
    unique: [true, 'Sorry username already exist!! try another one!']
  },
  email: {
    type: String,
    required: [true, 'A user must have an email address!'],
    unique: [true, 'Sorry email already exist!! try another one!'],
    // trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Email provided is invalid!']
  },
  profilePicture: {
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
    required: false,
    default: null
  },
  bio: {
    type: String,
    required: false,
    default: null
  },
  location: {
    type: String,
    required: false,
    default: null
  },
  password: {
    type: String,
    required: [true, 'A user must have a password!'],
    minlength: [8, 'Your password must have a minimum of 8 characters!'],
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'A user must have a password!'],
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
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
