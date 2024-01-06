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
const reusableCodeRouter = require('./routes/reusableCodeRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(bodyParser.json());

const mainUrl = '/api/v1';

app.use(`${mainUrl}/users`, userRouter);
app.use(`${mainUrl}/images`, imageRouter);
app.use(`${mainUrl}/reviews`, reviewRouter);
app.use(`${mainUrl}/comments`, commentRouter);
app.use(`${mainUrl}/bugs`, bugHandlerRouter);
app.use(`${mainUrl}/reusable_codes`, reusableCodeRouter);
app.use(`${mainUrl}/feedbacks`, feedbackRouter);
app.use(`${mainUrl}/events`, eventRouter);
app.use(`${mainUrl}/discussions`, discussionRouter);
app.use(`${mainUrl}/integrations`, apiIntegrationsRouter);
app.use(`${mainUrl}/search/bugs`, searchRouter);
app.use(`${mainUrl}/analytics/bugs`, analyticsRouter);
app.use(`${mainUrl}/docs`, docsRouter);
app.use(`${mainUrl}/resources`, docsRouter);
app.use(`${mainUrl}/social/share`, socialRouter);
app.use(`${mainUrl}/training`, trainingRouter);
app.use(`${mainUrl}/collaboration/slack`, collaborationRouter);

app.all('*', (req, res, next) => {
  next(
    appError(`Sorry!!! cannot find ${req.originalUrl} on this server!`, 404)
  );
});

app.use(globalErrorHandler);

module.exports = app;
