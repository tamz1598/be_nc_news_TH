const db = require('../db/connection');

exports.selectTopics = () =>{
    return db.query("SELECT * FROM topics;").then(({ rows }) => {
        return rows;
    });
}

exports.selectArticlesById = (id) => {
    return db.query('SELECT * FROM articles WHERE article_id=$1;', [id])
    .then(({ rows }) =>{
        return rows[0];
    })
}