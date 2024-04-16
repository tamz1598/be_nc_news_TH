const express = require('express');
const app = express();

// connect to controller
const { getTopics, getEndpoints, getArticlesById, getArticles, getCommentsByArticleId } = require('../controller/app.controller');

app.use(express.json());

// endpoints
app.get('/api/topics', getTopics);
app.get('/api/', getEndpoints);
app.get('/api/articles/:article_id', getArticlesById);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

// error handling
app.all('*', (request, response, next) => {
    response.status(404).send({ message: 'endpoint not found' });
  })
  
app.use((err, request, response, next) => {
    if (err.status && err.message)
      response.status(err.status).send({ message: err.message });
    next(err);
  });
  
  app.use((err, request, response, next) => {
    response.status(500).send({ message: 'internal server error'});
  });

  module.exports = app;