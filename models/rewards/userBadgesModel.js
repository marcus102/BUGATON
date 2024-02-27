const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['bronze', 'silver', 'gold'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  criteria: [
    {
      type: String,
      required: true
    }
  ],
  issuer: String,
  earned: {
    type: Boolean,
    default: false
  },
  earnedDate: {
    type: Date,
    default: Date.now()
  },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

// badgeSchema.virtual('image', {
//   ref: 'Image',
//   localField: '_id',
//   foreignField: 'user'
// });

const Badge = mongoose.model('Badge', badgeSchema);

module.exports = Badge;
