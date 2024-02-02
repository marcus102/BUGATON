const mongoose = require('mongoose');

const contributorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    bugFix: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserAttempt'
    },
    bugReport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BugReport'
    },
    reusableCode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ReusableCode'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

contributorSchema.pre('findOneAndUpdate', function(next) {
  this.getUpdate().updatedAt = Date.now();

  next();
});

const Contributor = mongoose.model('Contributor', contributorSchema);

module.exports = Contributor;
