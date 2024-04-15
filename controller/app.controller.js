const { selectTopics, selectArticlesById } = require('../model/model');
// connect to endpoints
const endpoints = require('../endpoints.json');

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
    selectArticlesById(article_id).then((articles) => {
        if (!articles){
            // If article not found, respond with 404
            return res.status(404).send({ message: 'article id not found' });
        }
        res.status(200).send({articles})
    })
    // error handling
    .catch((err) => {
    console.log(err)
    next(err);
    });
}
