const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    feedback: {
      type: String,
      required: [false, 'Provide a feedback']
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating.'],
      min: [1, 'Rating must be at least 1.'],
      max: [5, 'Rating must not exceed 5.']
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    agreement: {
      type: String,
      enum: [
        'strongly agree',
        'agree',
        'disagree',
        'strongly disagree',
        'neutral'
      ],
      default: 'neutral'
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

feedbackSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'username image'
  });

  next();
});

feedbackSchema.pre('save', function(next) {
  const fieldsToCheck = ['feedback', 'rating', 'agreement'];

  const isFieldsUnmodified = !fieldsToCheck.some(field =>
    this.isModified(field)
  );

  if (isFieldsUnmodified || this.isNew) {
    return next();
  }

  this.updatedAt = Date.now();
  next();
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
