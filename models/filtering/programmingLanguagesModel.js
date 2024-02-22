const mongoose = require('mongoose');

const languageSchema = new mongoose.Schema(
  {
    language: {
      type: String,
      enum: [
        'angular',
        'assembly',
        'c',
        'c#',
        'c++',
        'cobol',
        'css',
        'dart',
        'elixir',
        'erlang',
        'fortran',
        'go',
        'graphql',
        'groovy',
        'haskell',
        'html',
        'java',
        'javascript',
        'json',
        'kotlin',
        'lisp',
        'lua',
        'matlab',
        'mongodb-query-language',
        'node',
        'objective-c',
        'other',
        'perl',
        'php',
        'plaintext',
        'powershell',
        'python',
        'react',
        'ruby',
        'r',
        'rust',
        'scala',
        'shell',
        'sql',
        'swift',
        'typescript',
        'vue',
        'yaml',
        'racket',
        'scheme',
        'smalltalk',
        'tcl',
        'vhdl',
        'verilog',
        'arduino',
        'raspberry-pi',
        'fpga',
        'plc',
        'microcontroller',
        'all'
      ],
      default: 'all'
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    username: String,
    bugReport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BugReport'
    },
    bugFix: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserAttempt'
    },
    reusableCode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ReusableCode'
    },
    blogPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    },
    timestamp: {
      type: Date,
      default: Date.now()
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const Language = mongoose.model('Language', languageSchema);

module.exports = Language;
