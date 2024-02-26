const mongoose = require('mongoose');
const BugReport = require('./bugReportModel');

const bugFixSchema = new mongoose.Schema(
  {
    solution: {
      type: String,
      required: [true, 'Solution is required']
    },
    description: {
      type: String,
      default: null
    },
    result: {
      type: String,
      required: [true, 'Result to the solution must be provided!']
    },
    parentSolution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserAttempt'
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Bug solution must have a user']
    },
    bugReport: {
      type: mongoose.Schema.ObjectId,
      ref: 'BugReport',
      required: [true, 'The bug origin must be defined!']
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
    totalRatings: {
      type: Number,
      default: 0
    },
    frameworkVersions: [
      {
        name: String,
        version: String
      }
    ],
    totalAttempts: {
      type: Number,
      default: 0
    },
    reportCount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    createdAt: {
      type: Date,
      default: Date.now()
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

bugFixSchema.pre('findOneAndUpdate', function(next) {
  this.getUpdate().updatedAt = Date.now();

  next();
});

bugFixSchema.pre('save', function(next) {
  const fieldsToCheck = ['solution', 'description', 'result', 'frameworkVersions', 'contributors', 'status'];

  const isFieldsUnmodified = !fieldsToCheck.some(field => this.isModified(field));

  if (isFieldsUnmodified || this.isNew) {
    return next();
  }

  this.updatedAt = Date.now();
  next();
});

bugFixSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'username profile'
  }).populate({
    path: 'bugReport',
    select: 'title description'
  });

  next();
});

bugFixSchema.virtual('contributors', {
  ref: 'Contributor',
  localField: '_id',
  foreignField: 'bugFix'
});

bugFixSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'bugFix'
});

bugFixSchema.virtual('image', {
  ref: 'Image',
  localField: '_id',
  foreignField: 'bugFix'
});

bugFixSchema.virtual('categories', {
  ref: 'Category',
  localField: 'bugReport',
  foreignField: 'bugReport'
});

bugFixSchema.virtual('operatingSystem', {
  ref: 'OperatingSystem',
  localField: 'bugReport',
  foreignField: 'bugReport'
});

bugFixSchema.virtual('programmingLanguages', {
  ref: 'Language',
  localField: 'bugReport',
  foreignField: 'bugReport'
});

bugFixSchema.virtual('zoneOfInterests', {
  ref: 'ZoneOfInterest',
  localField: 'bugReport',
  foreignField: 'bugReport'
});

bugFixSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'bugFix'
});

bugFixSchema.virtual('childSolutions', {
  ref: 'UserAttempt',
  localField: '_id',
  foreignField: 'parentSolution'
});

bugFixSchema.statics.updateBugReportStats = async function(bugID) {
  const stats = await this.aggregate([
    {
      $match: { bugReport: bugID }
    },
    {
      $group: {
        _id: '$bugReport',
        nAttempts: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    const { nAttempts } = stats[0];
    await BugReport.findOneAndUpdate(
      { _id: bugID },
      {
        $set: {
          totalAttempts: nAttempts
        }
      },
      { new: true }
    );
  } else {
    await BugReport.findOneAndUpdate({ _id: bugID }, { $set: { totalAttempts: 0 } }, { new: true });
  }
};

bugFixSchema.post('save', function() {
  this.constructor.updateBugReportStats(this.bugReport);
});

const BugFixes = mongoose.model('BugFixes', bugFixSchema);

module.exports = BugFixes;
