const topicsRouter = require('express').Router();

// connect to controller
const { getTopics } = require('../controller/app.controller');

topicsRouter.get('/', getTopics);

module.exports = topicsRouter;
