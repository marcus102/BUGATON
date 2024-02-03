const express = require('express');
const blogPostController = require('../controllers/blogPostController');
const authenticatioController = require('../controllers/authenticatioController');
const categoriesRouter = require('./../routes/filtering/categoriesRoutes');

const router = express.Router({ mergeParams: true });

router.use(authenticatioController.protect);

router.use('/:blog_post_id/category', categoriesRouter);

router
  .route('/')
  .post(blogPostController.setRequiredIds, blogPostController.createBlogPost)
  .get(blogPostController.getAllBlogPosts);

router
  .route('/:id')
  .get(blogPostController.getBlogPost)
  .patch(blogPostController.updateBolgPost)
  .delete(blogPostController.deleteBlogPost);

module.exports = router;
