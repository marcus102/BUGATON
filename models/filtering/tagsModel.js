const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema(
  {
    tag: [
      {
        type: String,
        enum: [
          'AI-ethics',
          'Android',
          'FPGA-design',
          'Linux',
          'MacOS',
          'NFTs',
          'NoSQL',
          'ORM',
          'PLC-programming',
          'RESTful-architecture',
          'SQL',
          'SOLID-principles',
          'Windows',
          'agreement',
          'algorithm',
          'authentication',
          'backend',
          'big-data',
          'blockchain',
          'cloud-computing',
          'cloud-security',
          'computer-vision',
          'concurrency',
          'container-orchestration',
          'continuous-deployment',
          'continuous-integration',
          'cryptocurrency',
          'cross-platform',
          'cross-platform-development',
          'cybersecurity',
          'data-analytics',
          'data-cleaning',
          'data-engineering',
          'data-preprocessing',
          'data-science',
          'data-structures',
          'database-design',
          'declarative-programming',
          'deep-learning',
          'design-patterns',
          'design-principles',
          'distributed-systems',
          'encryption',
          'embedded-systems',
          'end-to-end-testing',
          'error-handling',
          'event-driven-architecture',
          'feature-engineering',
          'frontend',
          'full-stack',
          'functional-programming',
          'game-development',
          'graphics-programming',
          'hardware-design',
          'imperative-programming',
          'integration-testing',
          'IoT',
          'logging',
          'machine-learning',
          'microcontroller-programming',
          'mobile-development',
          'model-deployment',
          'model-evaluation',
          'model-training',
          'monitoring',
          'native-apps',
          'natural-language-processing',
          'networking',
          'object-oriented-programming',
          'operating-systems',
          'parallel-computing',
          'performance-testing',
          'progressive-web-apps',
          'rating',
          'reactive-programming',
          'responsive-design',
          'robotics',
          'search-algorithms',
          'secure-coding',
          'security',
          'software-architecture',
          'sorting-algorithms',
          'smart-contracts',
          'test-automation',
          'testing',
          'UI/UX-design',
          'unit-testing',
          'user-experience',
          'user-interface',
          'web-development',
          'web3',
          'other'
        ],
        default: 'other'
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

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
