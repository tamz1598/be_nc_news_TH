const { selectTopics, selectArticlesById, checkArticleExists, selectArticles, selectCommentsByArticleId } = require('../model/model');
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
            console.log(articles, '<--- exists when getting id');
            if (!articles) {
                return res.status(404).send({ message: 'Article not found' });
            }
            // Assuming selectCommentsByArticleId returns comments array directly
            selectCommentsByArticleId(article_id)
                .then((comments) => {
                    console.log(comments, ' <--- comments when getting id');
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


