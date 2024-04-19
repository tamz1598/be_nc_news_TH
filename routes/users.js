const usersRouter = require('express').Router();

// connect to controller
const { getUsers } = require('../controller/app.controller');

usersRouter.get('/', getUsers);

module.exports = usersRouter;