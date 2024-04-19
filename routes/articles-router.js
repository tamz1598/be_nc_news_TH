const articlesRouter = require('express').Router();

// connect to controller
const { getArticlesById, getArticles, getCommentsByArticleId } = require('../controller/app.controller');

articlesRouter.get('/', getArticles);
articlesRouter.get('/:article_id', getArticlesById);
articlesRouter.get('/:article_id/comments', getCommentsByArticleId);

module.exports = articlesRouter;