const mongoose = require('mongoose');

const userRankingSchema = new mongoose.Schema(
  {
    ranking: {
      type: String,
      enum: ['novice', 'intermediate', 'advanced', 'expert'],
      default: 'novice'
    },
    challengesCompleted: [
      {
        type: Number,
        default: 0
      }
    ],
    description: [String],
    earned: Boolean,
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

// badgeSchema.virtual('badges', {
//   ref: 'Badge',
//   localField: 'user',
//   foreignField: 'user'
// });

const UserRanking = mongoose.model('User', userRankingSchema);

module.exports = UserRanking;
