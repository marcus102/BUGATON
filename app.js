const express = require('express');
const morgan = require('morgan');
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

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// User Authentication and Authorization
app.use('/api/v1/user', userRoute);
// User reviews
app.use('/api/v1/review', reviewRoute);
// Bug Reporting and Tracking
app.use('/api/v1/bugs', bugHandlerRoute);
// Bug Fixing Workflow
app.use('/api/v1/bug-fixes', bugHandlerRoute);
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
    appError(`sorry!!! cannot find ${req.originalUrl} on this server!`, 404)
  );
});

app.use(globalErrorHandler);

module.exports = app;
