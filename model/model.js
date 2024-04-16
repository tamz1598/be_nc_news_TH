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
        console.log(articles,' <-- model select id')
        return articles[0];
    })   
}

exports.checkArticleExists = (article_id) => {
    return db
    .query(`SELECT * FROM articles WHERE article_id=$1;`, [article_id])
    .then(({ rows }) => {
        console.log(rows, '<-- model select check it exists')
        if ([rows].length === 0){
            // If nothing in array, respond with 404
            return Promise.reject({ status: 404, message: "article id not found"})
        }
    });
}
// select all articles where articles(article_id) = comment(article_id)
// count comment(article-id) as comment_count
// Join comment and article to show count

exports.selectArticles = () => {
    return db
    .query(`
    SELECT articles.article_id, articles.title, articles.author, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id 
    ORDER BY articles.created_at DESC;`)
    .then(({ rows }) => {
        return rows;
    });
}

exports.selectCommentsByArticleId = (article_id) => {
    return db
    .query(`SELECT * FROM comments WHERE article_id=$1;`, [article_id])
    .then(({ rows:comments }) =>{
        console.log(comments, '<-- comments got through')
        return comments;
    })
}