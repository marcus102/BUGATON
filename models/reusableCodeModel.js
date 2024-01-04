const mongoose = require('mongoose');

const reusableCodeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  codeSnippet: {
    type: String,
    required: true
  },
  tags: {
    type: [
      {
        type: String,
        enum: [
          'sorting-algorithms',
          'search-algorithms',
          'data-validation',
          'file-io',
          'string-manipulation',
          'object-oriented',
          'functional-programming',
          'imperative-programming',
          'javascript',
          'python',
          'java',
          'c++',
          'react',
          'express',
          'django',
          'tensorflow',
          'singleton-pattern',
          'observer-pattern',
          'factory-pattern',
          'linked-list',
          'tree-structures',
          'hash-tables',
          'stacks-and-queues',
          'date-time',
          'encryption',
          'testing',
          'debugging',
          'web-development',
          'machine-learning',
          'database-management',
          'other'
        ]
      }
    ],
    default: 'other'
  },
  language: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

reusableCodeSchema.virtual('image', {
  ref: 'Image',
  localField: '_id',
  foreignField: 'reusableCode'
});

const ReusableCode = mongoose.model('ReusableCode', reusableCodeSchema);

module.exports = ReusableCode;
