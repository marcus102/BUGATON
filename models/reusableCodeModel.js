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
    tags: {
      type: [
        {
          type: String,
          enum: [
            'algorithm',
            'data-structures',
            'search-algorithms',
            'sorting-algorithms',
            'software-architecture',
            'design-principles',
            'SOLID-principles',
            'design-patterns',
            'concurrency',
            'parallel-computing',
            'cloud-computing',
            'distributed-systems',
            'event-driven-architecture',
            'reactive-programming',
            'functional-programming',
            'object-oriented-programming',
            'imperative-programming',
            'declarative-programming',
            'web-development',
            'frontend',
            'backend',
            'full-stack',
            'mobile-development',
            'cross-platform-development',
            'responsive-design',
            'progressive-web-apps',
            'native-apps',
            'game-development',
            'graphics-programming',
            'UI/UX-design',
            'user-interface',
            'user-experience',
            'testing',
            'unit-testing',
            'integration-testing',
            'end-to-end-testing',
            'test-automation',
            'performance-testing',
            'security',
            'encryption',
            'authentication',
            'authorization',
            'secure-coding',
            'logging',
            'error-handling',
            'deployment',
            'container-orchestration',
            'continuous-integration',
            'continuous-deployment',
            'monitoring',
            'database-design',
            'SQL',
            'NoSQL',
            'ORM',
            'RESTful-architecture',
            'big-data',
            'data-visualization',
            'data-analytics',
            'data-engineering',
            'data-cleaning',
            'data-preprocessing',
            'feature-engineering',
            'model-training',
            'model-evaluation',
            'model-deployment',
            'machine-learning',
            'deep-learning',
            'natural-language-processing',
            'computer-vision',
            'data-science',
            'AI-ethics',
            'blockchain',
            'smart-contracts',
            'cryptocurrency',
            'web3',
            'NFTs',
            'robotics',
            'IoT',
            'hardware-design',
            'embedded-systems',
            'PLC-programming',
            'FPGA-design',
            'microcontroller-programming',
            'operating-systems',
            'networking',
            'cloud-security',
            'cybersecurity',
            'ethical-hacking',
            'Linux',
            'Windows',
            'MacOS',
            'iOS',
            'Android',
            'cross-platform',
            'other'
          ]
        }
      ],
      default: 'other'
    },
    language: {
      type: String,
      enum: [
        'angular',
        'assembly',
        'c',
        'c#',
        'c++',
        'cobol',
        'css',
        'dart',
        'elixir',
        'erlang',
        'fortran',
        'go',
        'graphql',
        'groovy',
        'haskell',
        'html',
        'java',
        'javascript',
        'json',
        'kotlin',
        'lisp',
        'lua',
        'matlab',
        'mongodb-query-language',
        'node',
        'objective-c',
        'other',
        'perl',
        'php',
        'plaintext',
        'powershell',
        'python',
        'react',
        'ruby',
        'r',
        'rust',
        'scala',
        'shell',
        'sql',
        'swift',
        'typescript',
        'vue',
        'yaml',
        'racket',
        'scheme',
        'smalltalk',
        'tcl',
        'vhdl',
        'verilog',
        'arduino',
        'raspberry-pi',
        'fpga',
        'plc',
        'microcontroller'
      ],
      default: 'other'
    },
    codeType: {
      type: String,
      enum: [
        'software',
        'hardware',
        'web',
        'mobile',
        'embedded-systems',
        'cloud',
        'networking',
        'security',
        'game-development',
        'data-science',
        'iot',
        'ai',
        'blockchain',
        'robotics',
        'augmented-reality',
        'virtual-reality',
        'machine-learning',
        'devops',
        'frontend',
        'backend',
        'full-stack',
        'database',
        'desktop',
        'operating-systems',
        'automation',
        'testing',
        'scripting',
        'frameworks',
        'libraries',
        'tools',
        'api',
        'microservices',
        'serverless',
        'mobile-frameworks',
        'real-time',
        'internet-of-things',
        'cloud-architecture',
        'containerization',
        'data-analytics',
        'artificial-intelligence',
        'game-engine',
        'cybersecurity',
        'virtualization',
        'business-intelligence',
        'blockchain-platforms',
        'embedded-firmware',
        'scientific-computing',
        'web-frameworks',
        'other'
      ],
      default: 'software'
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
    platformCompatibility: {
      type: [
        {
          type: String,
          enum: [
            'Windows',
            'MacOS',
            'Linux',
            'iOS',
            'Android',
            'Web',
            'Cross-platform',
            'Other'
          ],
          default: 'Other'
        }
      ],
      default: ['Other']
    },
    codeContributors: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ],
    zoneOfInterests: {
      type: [String],
      default: []
    },
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

const ReusableCode = mongoose.model('ReusableCode', reusableCodeSchema);

module.exports = ReusableCode;
