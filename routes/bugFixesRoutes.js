const express = require('express');
const commentsRouter = require('./../routes/commentsRoutes');
const reviewRouter = require('./../routes/reviewsRoutes');
const imageRouter = require('./../routes/imagesRoutes');
const authenticatioController = require('../controllers/authenticatioController');
const bugFixesController = require('../controllers/bugFixesController');

const router = express.Router({ mergeParams: true });

router.use('/:bug_fixes_id/comments', commentsRouter);
router.use('/:bug_fixes_id/reviews', reviewRouter);
router.use('/:bug_fixes_id/image', imageRouter);

router.use(authenticatioController.protect);

router.post(
  '/create',
  bugFixesController.setRequiredIds,
  bugFixesController.createBugFix
);

router.get('/', bugFixesController.getALLBugFixes);

router
  .route('/:id')
  .get(bugFixesController.getBugFix)
  .patch(bugFixesController.updateBugFix)
  .delete(bugFixesController.deleteBugFix);

module.exports = router;
