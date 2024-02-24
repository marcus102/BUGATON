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
    // tags: [
    //   {
    //     type: String,
    //     enum: [
    //       'AI-ethics',
    //       'Android',
    //       'FPGA-design',
    //       'Linux',
    //       'MacOS',
    //       'NFTs',
    //       'NoSQL',
    //       'ORM',
    //       'PLC-programming',
    //       'RESTful-architecture',
    //       'SQL',
    //       'SOLID-principles',
    //       'Windows',
    //       'agreement',
    //       'algorithm',
    //       'authentication',
    //       'backend',
    //       'big-data',
    //       'blockchain',
    //       'cloud-computing',
    //       'cloud-security',
    //       'computer-vision',
    //       'concurrency',
    //       'container-orchestration',
    //       'continuous-deployment',
    //       'continuous-integration',
    //       'cryptocurrency',
    //       'cross-platform',
    //       'cross-platform-development',
    //       'cybersecurity',
    //       'data-analytics',
    //       'data-cleaning',
    //       'data-engineering',
    //       'data-preprocessing',
    //       'data-science',
    //       'data-structures',
    //       'database-design',
    //       'declarative-programming',
    //       'deep-learning',
    //       'design-patterns',
    //       'design-principles',
    //       'distributed-systems',
    //       'encryption',
    //       'embedded-systems',
    //       'end-to-end-testing',
    //       'error-handling',
    //       'event-driven-architecture',
    //       'feature-engineering',
    //       'frontend',
    //       'full-stack',
    //       'functional-programming',
    //       'game-development',
    //       'graphics-programming',
    //       'hardware-design',
    //       'imperative-programming',
    //       'integration-testing',
    //       'IoT',
    //       'logging',
    //       'machine-learning',
    //       'microcontroller-programming',
    //       'mobile-development',
    //       'model-deployment',
    //       'model-evaluation',
    //       'model-training',
    //       'monitoring',
    //       'native-apps',
    //       'natural-language-processing',
    //       'networking',
    //       'object-oriented-programming',
    //       'operating-systems',
    //       'parallel-computing',
    //       'performance-testing',
    //       'progressive-web-apps',
    //       'rating',
    //       'reactive-programming',
    //       'responsive-design',
    //       'robotics',
    //       'search-algorithms',
    //       'secure-coding',
    //       'security',
    //       'software-architecture',
    //       'sorting-algorithms',
    //       'smart-contracts',
    //       'test-automation',
    //       'testing',
    //       'UI/UX-design',
    //       'unit-testing',
    //       'user-experience',
    //       'user-interface',
    //       'web-development',
    //       'web3',
    //       'other'
    //     ],
    //     default: 'other'
    //   }
    // ],
    // languages: [
    //   {
    //     type: String,
    //     enum: [
    //       'angular',
    //       'assembly',
    //       'c',
    //       'c#',
    //       'c++',
    //       'cobol',
    //       'css',
    //       'dart',
    //       'elixir',
    //       'erlang',
    //       'fortran',
    //       'go',
    //       'graphql',
    //       'groovy',
    //       'haskell',
    //       'html',
    //       'java',
    //       'javascript',
    //       'json',
    //       'kotlin',
    //       'lisp',
    //       'lua',
    //       'matlab',
    //       'mongodb-query-language',
    //       'node',
    //       'objective-c',
    //       'other',
    //       'perl',
    //       'php',
    //       'plaintext',
    //       'powershell',
    //       'python',
    //       'react',
    //       'ruby',
    //       'r',
    //       'rust',
    //       'scala',
    //       'shell',
    //       'sql',
    //       'swift',
    //       'typescript',
    //       'vue',
    //       'yaml',
    //       'racket',
    //       'scheme',
    //       'smalltalk',
    //       'tcl',
    //       'vhdl',
    //       'verilog',
    //       'arduino',
    //       'raspberry-pi',
    //       'fpga',
    //       'plc',
    //       'microcontroller'
    //     ],
    //     default: 'other'
    //   }
    // ],
    // codeType: [
    //   {
    //     type: String,
    //     enum: [
    //       'ai',
    //       'artificial-intelligence',
    //       'automation',
    //       'backend',
    //       'blockchain',
    //       'blockchain-platforms',
    //       'business-intelligence',
    //       'cloud',
    //       'cloud-architecture',
    //       'containerization',
    //       'cybersecurity',
    //       'data-analytics',
    //       'data-science',
    //       'database',
    //       'desktop',
    //       'devops',
    //       'embedded-firmware',
    //       'embedded-systems',
    //       'frontend',
    //       'frameworks',
    //       'full-stack',
    //       'game-development',
    //       'game-engine',
    //       'hardware',
    //       'internet-of-things',
    //       'iot',
    //       'libraries',
    //       'machine-learning',
    //       'microservices',
    //       'mobile',
    //       'mobile-frameworks',
    //       'networking',
    //       'operating-systems',
    //       'real-time',
    //       'robotics',
    //       'scripting',
    //       'security',
    //       'serverless',
    //       'software',
    //       'testing',
    //       'tools',
    //       'virtual-reality',
    //       'virtualization',
    //       'web',
    //       'web-frameworks',
    //       'other'
    //     ],
    //     default: 'software'
    //   }
    // ],
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
    // platformCompatibility: [
    //   {
    //     type: String,
    //     enum: [
    //       'Android',
    //       'Cross-platform',
    //       'iOS',
    //       'Linux',
    //       'MacOS',
    //       'Web',
    //       'Windows',
    //       'Other'
    //     ],
    //     default: 'Other'
    //   }
    // ],
    // contributors: [
    //   {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'User',
    //     default: null
    //   }
    // ],
    // zoneOfInterests: [
    //   {
    //     type: String,
    //     enum: [
    //       'education',
    //       'technology',
    //       'programming',
    //       'networking',
    //       'data Science',
    //       'security',
    //       'artificial Intelligence',
    //       'web Development',
    //       'other'
    //     ],
    //     default: 'other'
    //   }
    // ],
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
