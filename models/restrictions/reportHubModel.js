const mongoose = require('mongoose');

const reportHubSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    targetAccount: mongoose.Schema.Types.ObjectId,
    bugFix: mongoose.Schema.Types.ObjectId,
    bugReport: mongoose.Schema.Types.ObjectId,
    reusableCode: mongoose.Schema.Types.ObjectId,
    blogPost: mongoose.Schema.Types.ObjectId,
    comment: mongoose.Schema.Types.ObjectId,
    reason: {
      type: String,
      enum: ['spam', 'harassment', 'inappropriate content', 'other'],
      required: true
    },
    otherReason: String,
    description: String,
    createdAt: {
      type: Date,
      default: Date.now()
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const ReportHub = mongoose.model('ReportHub', reportHubSchema);

module.exports = ReportHub;
