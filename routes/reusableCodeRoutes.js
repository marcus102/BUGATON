const express = require('express');
const imageRouter = require('./imagesRoutes');
const commentRouter = require('./user_engagement/commentsRoutes');
const reviewRouter = require('./../routes/user_engagement/reviewsRoutes');
const likesRouter = require('./user_engagement/likeRoutes');
const categoriesRouter = require('./filtering/categoriesRoutes');
const operatingSystemRouter = require('./filtering/operatingSystemRoutes');
const programmingLanguagesRouter = require('./filtering/programmingLanguagesRoutes');
const zoneOfInterestRouter = require('./filtering/zoneOfInterestRoutes');
const reusableCodeController = require('./../controllers/reusableCodeControllerjs');
const contributorsController = require('../controllers/user_engagement/contributorsController');
const imagesController = require('./../controllers/imagesController');
const likesController = require('../controllers/user_engagement/likesController');
const authenticatioController = require('../controllers/authenticatioController');
const commentsController = require('../controllers/user_engagement/commentsControllers');
const reviewsController = require('../controllers/user_engagement/reviewsController');
const categoriesController = require('./../controllers/filtering/categoriesController');
const operatingSystemController = require('../controllers/filtering/operatingSystemController');
const programmingLanguagesController = require('./../controllers/filtering/programmingLanguagesController');
const zoneOfInterestController = require('./../controllers/filtering/zoneOfInterestController');

const router = express.Router({ mergeParams: true });

//engagement
router.use('/:reusable_code_id/image', imageRouter);
router.use('/:reusable_code_id/comment', commentRouter);
router.use('/:reusable_code_id/like', likesRouter);
router.use('/:reusable_code_id/review', reviewRouter);
//filtering
router.use('/:reusable_code_id/category', categoriesRouter);
router.use('/:reusable_code_id/platform', operatingSystemRouter);
router.use('/:reusable_code_id/language', programmingLanguagesRouter);
router.use('/:reusable_code_id/zone_of_interest', zoneOfInterestRouter);

router.use(authenticatioController.protect);

router
  .route('/')
  .get(reusableCodeController.getAllReusableCodes)
  .post(
    reusableCodeController.setRequiredIds,
    reusableCodeController.createReusableCode
  );
router
  .route('/:id')
  .get(reusableCodeController.getReusableCode)
  .patch(reusableCodeController.updateReusableCode)
  .delete(
    commentsController.deleteMultipleBugReportsCommentsById,
    imagesController.deletMultipleBugReportsImagesById,
    contributorsController.deleteMultipleContributionsById,
    likesController.deleteMultiplebugFixesLikesByArraysOfIds,
    reviewsController.deleteMultiplebugFixesReviewsByArrayOfIds,
    categoriesController.deleteMultipleReusableCodeCategoriesById,
    operatingSystemController.deleteMultipleReusableCodeOsPlatformById,
    programmingLanguagesController.deleteMultipleReusableCodeLanguageById,
    zoneOfInterestController.deleteMultipleReusableCodeZoneOfInterestById,
    reusableCodeController.deleteReusableCode
  );

module.exports = router;
