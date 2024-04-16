const { selectTopics, selectArticlesById, checkArticleExists } = require('../model/model');
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
        console.log(err)
        next(err);
    });
}


