const mongoose = require('mongoose');

const collaborationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    // category: {
    //   type: String
    // },
    targetAudience: {
      type: String
    },
    ideas: [
      {
        ideaText: {
          type: String,
          required: true
        },
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        createdAt: {
          type: Date,
          default: Date.now
        },
        votes: {
          type: Number,
          default: 0
        }
      }
    ],
    content: [
      {
        type: String
      }
    ],
    participants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        role: {
          type: String,
          required: true
        },
        joinedAt: {
          type: Date,
          default: Date.now()
        }
      }
    ],
    communicationChannels: [
      {
        type: String
      }
    ],
    status: {
      type: String,
      enum: ['active', 'in-progress', 'completed', 'stalled'],
      default: 'active'
    },
    deadlines: [
      {
        date: {
          type: Date,
          required: true
        },
        description: {
          type: String,
          required: true
        }
      }
    ],
    feedback: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Feedback'
      }
    ],
    notes: {
      type: String
    },
    budget: {
      type: Number,
      default: 0
    },
    visibility: {
      type: String,
      enum: ['public', 'private', 'restricted'],
      default: 'public'
    },
    files: [
      {
        type: String
      }
    ],
    versions: [
      {
        versionNumber: {
          type: String,
          required: true
        },
        description: {
          type: String
        }
      }
    ],
    externalTools: [
      {
        type: String
      }
    ],
    apiKeys: {
      type: Object
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

const Collaboration = mongoose.model('Collaboration', collaborationSchema);

module.exports = Collaboration;
