const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['bronze', 'silver', 'gold'],
    required: true
  },
  earned: {
    type: Boolean,
    default: false
  }
});

const Badge = mongoose.model('Badge', badgeSchema);

module.exports = Badge;
