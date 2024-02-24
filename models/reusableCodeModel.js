const mongoose = require('mongoose');

const reusableCodeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please! provide a tile to your code snippet.']
    },
    description: {
      type: String,
      required: [true, 'For users underdanding, a description must be defined']
    },
    codeSnippet: {
      type: String,
      required: [true, 'Please! the code snippet is rerquired! provide it']
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required here!']
    },
    viewCount: {
      type: Number,
      default: 0
    },
    likeCount: {
      type: Number,
      default: 0
    },
    downloadCount: {
      type: Number,
      default: 0
    },
    shareCount: {
      type: Number,
      default: 0
    },
    reportCount: {
      type: Number,
      default: 0
    },
    license: String,
    documentationLink: String,
    testingInfo: String,
    versionControl: String,
    repositoryLink: String,
    frameworkVersions: [
      {
        name: String,
        version: String
      }
    ],
    usageStatistics: String,
    deploymentInfo: String,
    codeQualityMetrics: String,
    securityInfo: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: null
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reusableCodeSchema.virtual('image', {
  ref: 'Image',
  localField: '_id',
  foreignField: 'reusableCode'
});

reusableCodeSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'reusableCode'
});

reusableCodeSchema.pre('findOneAndUpdate', function(next) {
  this.getUpdate().updatedAt = Date.now();

  next();
});

const ReusableCode = mongoose.model('ReusableCode', reusableCodeSchema);

module.exports = ReusableCode;
