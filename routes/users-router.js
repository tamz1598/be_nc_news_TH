const usersRouter = require('express').Router();

// connect to controller
const { getUsers, getUsersByUsername } = require('../controller/app.controller');

usersRouter.get('/', getUsers);
usersRouter.get('/:username', getUsersByUsername);

module.exports = usersRouter;