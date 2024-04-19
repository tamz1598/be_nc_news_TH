// api-router.js
const apiRouter = require('express').Router();
const articlesRouter = require('./articles-router');
const topicsRouter = require('./topics-router');
const usersRouter = require('./users-router');
const commentsRouter = require('./comment-router');

apiRouter.use('/articles', articlesRouter);
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/comments', commentsRouter);

// connect to controller
const { getEndpoints } = require('../controller/app.controller');

apiRouter.get('/', (req, res) => {
  res.status(200).send('All OK from API Router');
});

apiRouter.get('/', getEndpoints);

module.exports = apiRouter;