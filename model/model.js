const db = require('../db/connection');

exports.selectTopics = () =>{
    return db
    .query("SELECT * FROM topics;").then(({ rows }) => {
        return rows;
    });
}


exports.selectArticlesById = (article_id) => {
    return db
    .query('SELECT * FROM articles WHERE article_id=$1;', [article_id])
    .then(({ rows:articles }) =>{
        return articles[0];
    })   
}

exports.checkArticleExists = (article_id) => {
    return db
    .query('SELECT * FROM articles WHERE article_id=$1;', [article_id])
    .then(({ rows:articles }) => {
        if (!articles){
            // If nothing in array, respond with 404
            return Promise.reject({ status: 404, message: "article id not found"})
        }
    });
}