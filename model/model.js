const db = require('../db/connection');
const format = require('pg-format');

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
    .query(`SELECT * FROM articles WHERE article_id=$1;`, [article_id])
    .then(({ rows }) => {
        if ([rows].length === 0){
            // If nothing in array, respond with 404
            return Promise.reject({ status: 404, message: "article id not found"})
        }
    });
}
// select all articles where articles(article_id) = comment(article_id)
// count comment(article-id) as comment_count
// Join comment and article to show count

exports.selectArticles = (topic) => {
    const validTopics = [
        { slug: 'mitch' },
        { slug: 'cats' },
        { slug: 'paper' }
    ];

    const validTopicSlugs = validTopics.map(topic => topic.slug);
    const isValid = validTopicSlugs.includes(topic);

    if (!isValid && topic) {
        return Promise.reject({ status: 404, message: 'Topic not found' }); // Reject the promise with a status and a message
    }

    let query = `
    SELECT articles.article_id, articles.title, articles.author, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id`;

    const values = [];

    if (topic) {
        query += ` WHERE articles.topic = $1`;
        values.push(topic);
    }

    query += ` GROUP BY articles.article_id 
    ORDER BY articles.created_at DESC;`;

    return db
    .query(query, values)
    .then(({ rows }) => {
        return rows;
    });
}

exports.selectCommentsByArticleId = (article_id) => {
    return db
    .query(`SELECT * FROM comments WHERE article_id=$1;`, [article_id])
    .then(({ rows:comments }) =>{
        return comments;
    })
}

exports.insertCommentByArtistId = (newComment) => {
    const sqlString = format(`
        INSERT INTO comments
        (body, article_id, author, votes, created_at)
        VALUES %L RETURNING *;`,
        [[newComment.body, newComment.article_id, newComment.author, newComment.votes, newComment.created_at]])
    return db.query(sqlString)
    .then(({ rows }) => {
        return rows[0];
    });

}

exports.updateArticleByArticleId = (article_id, inc_votes) => {
    const sqlUpdateString = format(`UPDATE articles SET votes = votes + %L WHERE article_id = %L RETURNING *;`, inc_votes, article_id)
    return db.query(sqlUpdateString)
    .then(({ rows:update }) => {
        return update[0];
    })
}

exports.deleteCommentByCommentId = (comment_id) => {
    return db
    .query('DELETE FROM comments WHERE comment_id = $1', [comment_id]);
}

exports.selectUsers = () =>{
    return db
    .query("SELECT * FROM users;").then(({ rows }) => {
        return rows;
    });
}
