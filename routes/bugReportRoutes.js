const express = require('express');
const commentsRouter = require('./user_engagement/commentsRoutes');
const imageRouter = require('./imagesRoutes');
const bugFixRouter = require('./bugFixesRoutes');
const categoriesRouter = require('./filtering/categoriesRoutes');
const operatingSystemRouter = require('./filtering/operatingSystemRoutes');
const programmingLanguagesRouter = require('./filtering/programmingLanguagesRoutes');
const zoneOfInterestRouter = require('./filtering/zoneOfInterestRoutes');
const bugFixesController = require('../controllers/bugFixesController');
const contributorsController = require('../controllers/user_engagement/contributorsController');
const imagesController = require('./../controllers/imagesController');
const likesController = require('../controllers/user_engagement/likesController');
const authenticatioController = require('../controllers/authenticatioController');
const commentsController = require('../controllers/user_engagement/commentsControllers');
const bugReportController = require('../controllers/bugReportController');
const reviewsController = require('../controllers/user_engagement/reviewsController');
const categoriesController = require('./../controllers/filtering/categoriesController');
const operatingSystemController = require('../controllers/filtering/operatingSystemController');
const programmingLanguagesController = require('./../controllers/filtering/programmingLanguagesController');
const zoneOfInterestController = require('./../controllers/filtering/zoneOfInterestController');

const router = express.Router({ mergeParams: true });

//engagement
router.use('/:bug_id/comments', commentsRouter);
router.use('/:bug_id/image', imageRouter);
router.use('/:bug_id/bug_fix', bugFixRouter);
//filtering
router.use('/:bug_id/category', categoriesRouter);
router.use('/:bug_id/operating_system', operatingSystemRouter);
router.use('/:bug_id/language', programmingLanguagesRouter);
router.use('/:bug_id/zone_of_interest', zoneOfInterestRouter);

router.use(authenticatioController.protect);

router
  .route('/')
  .get(bugReportController.getAllBugs)
  .post(bugReportController.setRequiredIds, bugReportController.createBug);

router
  .route('/:id')
  .get(bugReportController.getBug)
  .patch(bugReportController.updateBug)
  .delete(
    commentsController.deleteMultipleBugReportsCommentsById,
    imagesController.deletMultipleBugReportsImagesById,
    contributorsController.deleteMultipleContributionsById,
    bugFixesController.deleteMultipleBugFixesById,
    commentsController.deleteMultipleBugFixesCommentsByArraysOfIds,
    likesController.deleteMultiplebugFixesLikesByArraysOfIds,
    imagesController.deletMultipleBugFixesImagesByArraysOfIds,
    reviewsController.deleteMultiplebugFixesReviewsByArrayOfIds,
    categoriesController.deleteMultipleBugReportCategoriesById,
    operatingSystemController.deleteMultipleBugReportOsPlatformById,
    programmingLanguagesController.deleteMultipleBugReportLanguageById,
    zoneOfInterestController.deleteMultipleBugReportZoneOfInterestById,
    bugReportController.deleteBug
  );

router.patch(
  '/:id/assignBugTo/:assigneeId',
  bugReportController.setRequiredIds,
  bugReportController.assignBugToUser
);

router.patch(
  '/:id/deassignBugTo/:assigneeId',
  bugReportController.setRequiredIds,
  bugReportController.deassignBugFromUser
);

module.exports = router;
