const { selectTopics, selectArticlesById, checkArticleExists, selectArticles, selectCommentsByArticleId, insertCommentByArtistId, updateArticleByArticleId, deleteCommentByCommentId } = require('../model/model');
// connect to endpoints
const endpoints = require('../endpoints.json');
const articles = require('../db/data/test-data/articles');

exports.getTopics = (req, res, next) => {
    selectTopics().then((topics) => {
        res.status(200).send({ topics });
    })
    // error handling
    .catch((err) => {
    next(err);
    });
}

exports.getEndpoints = (req, res, next) =>{
    res.status(200).send({ endpoints });
}

exports.getArticlesById = (req, res, next) => {
    const { article_id } = req.params;

    Promise.all([checkArticleExists(article_id), selectArticlesById(article_id)])

    selectArticlesById(article_id)
    .then((articles) => {
        if (!articles) {
            return res.status(404).send({ message: 'article id not found' });
        }
        res.status(200).send({ articles });
    })
    // error handling
    .catch((err) => {
        next(err);
    });
}

exports.getArticles = (req, res, next) => {
    selectArticles()
    .then((articles) => {
        res.status(200).send({ articles });
    })
    .catch((err) => {
        next(err);
    });
}

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
   
 Promise.all([checkArticleExists(article_id), selectArticlesById(article_id)])
    .then(([exists, articles]) => {
        if (!articles) {
            return res.status(404).send({ message: 'Article not found' });
        }
        // Assuming selectCommentsByArticleId returns comments array directly
        selectCommentsByArticleId(article_id)
            .then((comments) => {
                res.status(200).send({ comments });
            })
            .catch((err) => {
                next(err);
            });
    })
    .catch((err) => {
        next(err);
    });
}

exports.postCommentsByArticleId = (req, res, next) => {
    const { username, body } = req.body;
    const article_id = req.params.article_id;

    // Check if username is missing or an invalid input
    if (!username || typeof username !== 'string') {
        return res.status(400).send({ message: 'This is a bad request, please check your username.' });
    }

    // Check if body is missing or an invalid input
    if (!body || typeof body !== 'string') {
        return res.status(400).send({ message: 'This is a bad request, please check your message.' });
    }
   
    const newComment = {
        body: body,
        article_id,
        author: username,
        votes: 0,
        created_at: new Date().toISOString() 
    };

    insertCommentByArtistId(newComment)
    .then((comment) => {
        res.status(201).send({ comment });
    })
    .catch((err) => {
        next(err);
    });
}

exports.patchArticleByArticleId = (req, res, next) => {
    // retrieve data
    const { article_id } = req.params;
    const { inc_votes } = req.body;

    // error handling check data input
    if (!inc_votes || typeof inc_votes !== 'number') {
        return res.status(400).send({ message: 'This is a bad request, invalid format or votes is missing.' });
    }

    // update article
    updateArticleByArticleId(article_id, inc_votes)
    .then((update) => {
        res.status(202).send({update})
    })
    .catch((err) => {
        next(err);
    });
}

exports.deleteCommentByCommentId = (req, res, next) => {
    // retrieve data
    const { comment_id } = req.params;

    // delete article
    deleteCommentByCommentId(comment_id)
    .then(() => {
        res.sendStatus(204);
    })
    .catch((err) => {
        next( err);
    });
}

