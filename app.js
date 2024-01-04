const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const globalErrorHandler = require('./controllers/errorsController');
const appError = require('./utils/appError');
const bugHandlerRouter = require('./routes/bugHandlerRoutes');
// const bugFixesRouter = require('./routes/bugFixesRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewsRoutes');
const analyticsRouter = require('./routes/analyticsRoutes');
const apiIntegrationsRouter = require('./routes/apiIntegrationsRoutes');
const collaborationRouter = require('./routes/collaborationRoutes');
const discussionRouter = require('./routes/discussionRoutes');
const docsRouter = require('./routes/docsRoutes');
const eventRouter = require('./routes/eventRoutes');
const feedbackRouter = require('./routes/feedbackRoutes');
const searchRouter = require('./routes/searchRoutes');
const socialRouter = require('./routes/socialRoutes');
const trainingRouter = require('./routes/trainingRoutes');
const commentRouter = require('./routes/commentsRoutes');
const imageRouter = require('./routes/imagesRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(bodyParser.json());

// User Authentication and Authorization
app.use('/api/v1/users', userRouter);
// User Authentication and Authorization
app.use('/api/v1/images', imageRouter);
// User reviews
app.use('/api/v1/reviews', reviewRouter);
// User comments
app.use('/api/v1/comments', commentRouter);
// Bug Reporting and Tracking
app.use('/api/v1/bugs', bugHandlerRouter);
// Bug Fixing
// app.use('/api/v1/bug_fixes', bugFixesRouter);
// Bugathon Events
app.use('/api/v1/events', eventRouter);
// Community Collaboration
app.use('/api/v1/discussions', discussionRouter);
// API Integration
app.use('/api/v1/integrations', apiIntegrationsRouter);
// Search and Filters
app.use('/api/v1/search/bugs', searchRouter);
// Analytics and Reporting
app.use('/api/v1/analytics/bugs', analyticsRouter);
// Documentation and Resources
app.use('/api/v1/docs', docsRouter);
app.use('/api/v1/resources', docsRouter);
// Feedback Mechanism
app.use('/api/v1/feedback', feedbackRouter);
// Social Media Integration
app.use('/api/v1/social/share', socialRouter);
// Training and Workshops
app.use('/api/v1/training', trainingRouter);
// Collaborative Tools Integration
app.use('/api/v1/collaboration/slack', collaborationRouter);

// Real-time Notifications:
//WebSocket integration for real-time notifications on bug updates.

app.all('*', (req, res, next) => {
  next(
    appError(`Sorry!!! cannot find ${req.originalUrl} on this server!`, 404)
  );
});

app.use(globalErrorHandler);

module.exports = app;
