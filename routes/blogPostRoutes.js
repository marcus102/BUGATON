const express = require('express');
const commentsRouter = require('./user_engagement/commentsRoutes');
const reviewRouter = require('./user_engagement/reviewsRoutes');
const imageRouter = require('./imagesRoutes');
const likesRouter = require('./user_engagement/likeRoutes');
const operatingSystemRouter = require('./filtering/operatingSystemRoutes');
const programmingLanguagesRouter = require('./filtering/programmingLanguagesRoutes');
const zoneOfInterestRouter = require('./filtering/zoneOfInterestRoutes');
const categoriesRouter = require('./../routes/filtering/categoriesRoutes');
const reportHubRouter = require('./restrictions/reportHubRoutes');
const commentsController = require('../controllers/user_engagement/commentsControllers');
const authenticatioController = require('../controllers/authenticatioController');
const likesController = require('../controllers/user_engagement/likesController');
const imagesController = require('./../controllers/imagesController');
const reviewsController = require('../controllers/user_engagement/reviewsController');
const blogPostController = require('../controllers/blogPostController');
const categoriesController = require('./../controllers/filtering/categoriesController');
const operatingSystemController = require('../controllers/filtering/operatingSystemController');
const programmingLanguagesController = require('./../controllers/filtering/programmingLanguagesController');
const zoneOfInterestController = require('./../controllers/filtering/zoneOfInterestController');

const router = express.Router({ mergeParams: true });

//engagement
router.use('/:blog_post_id/comments', commentsRouter);
router.use('/:blog_post_id/reviews', reviewRouter);
router.use('/:blog_post_id/image', imageRouter);
router.use('/:blog_post_id/likes', likesRouter);
//filtering
router.use('/:blog_post_id/category', categoriesRouter);
router.use('/:blog_post_id/operating_system', operatingSystemRouter);
router.use('/:blog_post_id/language', programmingLanguagesRouter);
router.use('/:blog_post_id/zone_of_interest', zoneOfInterestRouter);
//restricitions
router.use('/:blog_post_id/report_blog_post', reportHubRouter);

router.use(authenticatioController.protect);

router
  .route('/')
  .post(blogPostController.setRequiredIds, blogPostController.createBlogPost)
  .get(blogPostController.getAllBlogPosts);

router
  .route('/:id')
  .get(blogPostController.getBlogPost)
  .patch(blogPostController.updateBolgPost)
  .delete(
    commentsController.deleteMultipleBugFixesCommentsById,
    reviewsController.deleteMultiplebugFixesReviewsById,
    likesController.deleteMultiplebugFixesLikesById,
    imagesController.deletMultipleBugFixesImagesById,
    categoriesController.deleteMultipleBlogPostCategoriesById,
    operatingSystemController.deleteMultipleBlogPostOsPlatformById,
    programmingLanguagesController.deleteMultipleBlogPostLanguageById,
    zoneOfInterestController.deleteMultipleBlogPostZoneOfInterestById,
    blogPostController.deleteBlogPost
  );

module.exports = router;
