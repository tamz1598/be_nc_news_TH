// api-router.js
const apiRouter = require('express').Router();
const articlesRouter = require('./articles');
const topicsRouter = require('./topics');
const usersRouter = require('./users');
const commentsRouter = require('./comment');

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