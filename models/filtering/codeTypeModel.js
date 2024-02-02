const mongoose = require('mongoose');

const codeTypeSchema = new mongoose.Schema(
  {
    codeType: [
      {
        type: String,
        enum: [
          'ai',
          'artificial-intelligence',
          'automation',
          'backend',
          'blockchain',
          'blockchain-platforms',
          'business-intelligence',
          'cloud',
          'cloud-architecture',
          'containerization',
          'cybersecurity',
          'data-analytics',
          'data-science',
          'database',
          'desktop',
          'devops',
          'embedded-firmware',
          'embedded-systems',
          'frontend',
          'frameworks',
          'full-stack',
          'game-development',
          'game-engine',
          'hardware',
          'internet-of-things',
          'iot',
          'libraries',
          'machine-learning',
          'microservices',
          'mobile',
          'mobile-frameworks',
          'networking',
          'operating-systems',
          'real-time',
          'robotics',
          'scripting',
          'security',
          'serverless',
          'software',
          'testing',
          'tools',
          'virtual-reality',
          'virtualization',
          'web',
          'web-frameworks',
          'other'
        ],
        default: 'software'
      }
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
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

const CodeType = mongoose.model('CodeType', codeTypeSchema);

module.exports = CodeType;
