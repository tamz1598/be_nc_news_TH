const { selectTopics } = require('../model/model');
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
    res.status(200).send({ endpoints })
}
