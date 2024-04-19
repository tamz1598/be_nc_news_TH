const commentsRouter = require('express').Router();

// connect to controller
const { deleteCommentByCommentId } = require('../controller/app.controller');

commentsRouter.delete('/:comment_id', deleteCommentByCommentId);



module.exports = commentsRouter;