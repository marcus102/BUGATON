const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: [true, 'Image URL not provided!']
    },
    caption: {
      type: String,
      default: null
    },
    tags: {
      type: [
        {
          type: String,
          enum: [
            'Nature',
            'Animals',
            'Architecture',
            'People',
            'Technology',
            'Food',
            'Travel',
            'Happy',
            'Sad',
            'Exciting',
            'Serene',
            'Funny',
            'Romantic',
            'Red',
            'Blue',
            'Green',
            'BlackAndWhite',
            'Pastel',
            'Wedding',
            'Birthday',
            'Party',
            'Concert',
            'Vacation',
            'Abstract',
            'Minimalist',
            'Vintage',
            'Retro',
            'Urban',
            'HDR',
            'Bokeh',
            'LongExposure',
            'Macro',
            'Panorama',
            'City',
            'Beach',
            'Mountains',
            'Countryside',
            'Urban',
            'Sports',
            'Music',
            'Art',
            'Fitness',
            'Gaming',
            'Spring',
            'Summer',
            'Autumn',
            'Winter',
            'MovieReference',
            'BookReference',
            'TVShowReference',
            'MusicBandReference'
          ]
        }
      ],
      default: 'Technology'
    },
    description: {
      type: String,
      default: null
    },
    privacy: {
      type: String,
      enum: ['public', 'private', 'shared'],
      default: 'public'
    },
    fileFormat: {
      type: String,
      validate: {
        validator: function(value) {
          // Define the accepted image formats (add or remove as needed)
          const acceptedFormats = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];

          // Extract the file extension from the value
          const fileExtension = this.imageUrl
            .toLowerCase()
            .split('.')
            .pop();

          // Check if the file extension is in the accepted formats
          return acceptedFormats.includes(fileExtension);
        },
        message:
          'Invalid file format. Accepted formats: jpg, jpeg, png, gif, bmp'
      }
    },
    size: Number,
    downloads: {
      type: Number,
      default: 0
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'User must be provided!']
    },
    bugReport: {
      type: mongoose.Schema.ObjectId,
      ref: 'BugReport'
    },
    reusableCode: {
      type: mongoose.Schema.ObjectId,
      ref: 'ReusableCode'
    },
    bugFix: {
      type: mongoose.Schema.ObjectId,
      ref: 'UserAttempt'
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

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
