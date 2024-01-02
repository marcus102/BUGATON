const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const globalErrorHandler = require('./controllers/errorsController');
const appError = require('./utils/appError');
const bugHandlerRoute = require('./routes/bugHandlerRoutes');
const userRoute = require('./routes/userRoutes');
const reviewRoute = require('./routes/reviewsRoutes');
const analyticsRoute = require('./routes/analyticsRoutes');
const apiIntegrationsRoute = require('./routes/apiIntegrationsRoutes');
const collaborationRoute = require('./routes/collaborationRoutes');
const discussionRoute = require('./routes/discussionRoutes');
const docsRoute = require('./routes/docsRoutes');
const eventRoute = require('./routes/eventRoutes');
const feedbackRoute = require('./routes/feedbackRoutes');
const searchRoute = require('./routes/searchRoutes');
const socialRoute = require('./routes/socialRoutes');
const trainingRoute = require('./routes/trainingRoutes');
const commentRoute = require('./routes/commentsRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(bodyParser.json());

// User Authentication and Authorization
app.use('/api/v1/users', userRoute);
// User reviews
app.use('/api/v1/review', reviewRoute);
// User comments
app.use('/api/v1/comment', commentRoute);
// Bug Reporting and Tracking
app.use('/api/v1/bugs', bugHandlerRoute);
// Bugathon Events
app.use('/api/v1/events', eventRoute);
// Community Collaboration
app.use('/api/v1/discussions', discussionRoute);
// API Integration
app.use('/api/v1/integrations', apiIntegrationsRoute);
// Search and Filters
app.use('/api/v1/search/bugs', searchRoute);
// Analytics and Reporting
app.use('/api/v1/analytics/bugs', analyticsRoute);
// Documentation and Resources
app.use('/api/v1/docs', docsRoute);
app.use('/api/v1/resources', docsRoute);
// Feedback Mechanism
app.use('/api/v1/feedback', feedbackRoute);
// Social Media Integration
app.use('/api/v1/social/share', socialRoute);
// Training and Workshops
app.use('/api/v1/training', trainingRoute);
// Collaborative Tools Integration
app.use('/api/v1/collaboration/slack', collaborationRoute);

// Real-time Notifications:
//WebSocket integration for real-time notifications on bug updates.

app.all('*', (req, res, next) => {
  next(
    appError(`Sorry!!! cannot find ${req.originalUrl} on this server!`, 404)
  );
});

app.use(globalErrorHandler);

module.exports = app;
