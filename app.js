const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const globalErrorHandler = require('./controllers/errorsController');
const appError = require('./utils/appError');
const bugReportRouter = require('./routes/bugReportRoutes');
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
const reusableCodeRouter = require('./routes/reusableCodeRoutes');
const bugFixRouter = require('./routes/bugFixesRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(bodyParser.json());

const rootUrl = '/api/v1';

app.use(`${rootUrl}/users`, userRouter);
app.use(`${rootUrl}/images`, imageRouter);
app.use(`${rootUrl}/reviews`, reviewRouter);
app.use(`${rootUrl}/comments`, commentRouter);
app.use(`${rootUrl}/bugs`, bugReportRouter);
app.use(`${rootUrl}/bug_fixes`, bugFixRouter);
app.use(`${rootUrl}/reusable_codes`, reusableCodeRouter);
app.use(`${rootUrl}/feedbacks`, feedbackRouter);
app.use(`${rootUrl}/events`, eventRouter);
app.use(`${rootUrl}/discussions`, discussionRouter);
app.use(`${rootUrl}/integrations`, apiIntegrationsRouter);
app.use(`${rootUrl}/search/bugs`, searchRouter);
app.use(`${rootUrl}/analytics/bugs`, analyticsRouter);
app.use(`${rootUrl}/docs`, docsRouter);
app.use(`${rootUrl}/resources`, docsRouter);
app.use(`${rootUrl}/social/share`, socialRouter);
app.use(`${rootUrl}/training`, trainingRouter);
app.use(`${rootUrl}/collaboration/slack`, collaborationRouter);

app.all('*', (req, res, next) => {
  next(
    appError(`Sorry!!! cannot find ${req.originalUrl} on this server!`, 404)
  );
});

app.use(globalErrorHandler);

module.exports = app;
