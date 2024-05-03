const express = require('express');
const app = express();
const apiRouter = require('./routes/api');
const cors = require('cors');

// connect to controller
const { postCommentsByArticleId, patchArticleByArticleId, patchCommentByCommentId, postArticlesByArticleId} = require('./controller/app.controller');

app.use('/api', apiRouter);
app.use(express.json());
app.use(cors());

// endpoints

app.post('/api/articles', postArticlesByArticleId);
app.post('/api/articles/:article_id/comments', postCommentsByArticleId);
app.patch('/api/articles/:article_id', patchArticleByArticleId);

app.patch('/api/comments/:comment_id', patchCommentByCommentId);


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
