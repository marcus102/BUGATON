const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['bronze', 'silver', 'gold'],
      required: true
    },
    description: [String],
    criteria: [
      {
        type: String,
        required: true
      }
    ],
    earned: {
      type: Boolean,
      default: false
    },
    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public'
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Ranking must be relted to a user']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// badgeSchema.virtual('image', {
//   ref: 'Image',
//   localField: '_id',
//   foreignField: 'user'
// });

const Badge = mongoose.model('Badge', badgeSchema);

module.exports = Badge;
