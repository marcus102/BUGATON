const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255
  },
  content: {
    type: String,
    required: true
  },
  // images: [
  //   {
  //     type: String,
  //     default: []
  //   }
  // ],
  // contributors: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'User'
  //   }
  // ],
  viewCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  // categories: [
  //   {
  //     type: String,
  //     enum: ['node.js', 'coding', 'Other'],
  //     default: 'Other'
  //   }
  // ],
  // tag: {
  //   type: String,
  //   enum: ['tag1', 'tag2', 'Other'],
  //   default: 'Other'
  // },
  flagged: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// blogSchema.virtual('likes', {
//   ref: 'Like',
//   localField: '_id',
//   foreignField: 'post',
//   count: true
// });

// blogSchema.virtual('comments', {
//   ref: 'Comment',
//   localField: '_id',
//   foreignField: 'post',
//   count: true
// });

// blogSchema.virtual('shares', {
//   ref: 'Share',
//   localField: '_id',
//   foreignField: 'post',
//   count: true
// });

// blogSchema.pre('save', function(next) {
//   this.updatedAt = Date.now();
//   next();
// });

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
