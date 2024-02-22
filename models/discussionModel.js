const mongoose = require('mongoose');

const discussionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Discussion'
      }
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
      }
    ],
    tags: [
      {
        type: String,
        enum: ['education', 'coding', 'codeathon', 'collaboration', 'general', 'other'],
        default: 'general'
      }
    ],
    likes: {
      type: Number,
      default: 0
    },
    viewCount: {
      type: Number,
      default: 0
    },
    subscribers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    //   reports: [
    //     {
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: 'Report'
    //     }
    //   ],
    visibility: {
      type: String,
      enum: ['Public', 'Private', 'Protected'],
      default: 'Public'
    },
    attachments: [
      {
        type: String,
        default: []
      }
    ],
    lastActiveUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    isFlagged: {
      type: Boolean,
      default: false
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isClosed: {
      type: Boolean,
      default: false
    },
    isPinned: {
      type: Boolean,
      default: false
    },
    lastUserPosted: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    lastCommentAt: {
      type: Date,
      default: null
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

const Discussion = mongoose.model('Discussion', discussionSchema);

module.exports = Discussion;
