const mongoose = require('mongoose');
const BugReport = require('./bugReportModel');

const userAttemptSchema = new mongoose.Schema(
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

userAttemptSchema.pre('findOneAndUpdate', function(next) {
  this.getUpdate().updatedAt = Date.now();

  next();
});

userAttemptSchema.pre('save', function(next) {
  const fieldsToCheck = ['solution', 'description', 'result', 'frameworkVersions', 'contributors', 'status'];

  const isFieldsUnmodified = !fieldsToCheck.some(field => this.isModified(field));

  if (isFieldsUnmodified || this.isNew) {
    return next();
  }

  this.updatedAt = Date.now();
  next();
});

userAttemptSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'username profile'
  }).populate({
    path: 'bugReport',
    select: 'title description'
  });

  next();
});

userAttemptSchema.virtual('contributors', {
  ref: 'Contributor',
  localField: '_id',
  foreignField: 'bugFix'
});

userAttemptSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'bugFix'
});

userAttemptSchema.virtual('image', {
  ref: 'Image',
  localField: '_id',
  foreignField: 'bugFix'
});

userAttemptSchema.virtual('categories', {
  ref: 'Category',
  localField: 'bugReport',
  foreignField: 'bugReport'
});

userAttemptSchema.virtual('operatingSystem', {
  ref: 'OperatingSystem',
  localField: 'bugReport',
  foreignField: 'bugReport'
});

userAttemptSchema.virtual('programmingLanguages', {
  ref: 'Language',
  localField: 'bugReport',
  foreignField: 'bugReport'
});

userAttemptSchema.virtual('zoneOfInterests', {
  ref: 'ZoneOfInterest',
  localField: 'bugReport',
  foreignField: 'bugReport'
});

userAttemptSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'bugFix'
});

userAttemptSchema.virtual('childSolutions', {
  ref: 'UserAttempt',
  localField: '_id',
  foreignField: 'parentSolution'
});

userAttemptSchema.statics.updateBugReportStats = async function(bugID) {
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

userAttemptSchema.post('save', function() {
  this.constructor.updateBugReportStats(this.bugReport);
});

const UserAttempt = mongoose.model('UserAttempt', userAttemptSchema);

module.exports = UserAttempt;
