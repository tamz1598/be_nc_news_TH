const db = require('../db/connection');
const format = require('pg-format');

// GET TOPIC
exports.selectTopics = () =>{
    return db
    .query("SELECT * FROM topics;").then(({ rows }) => {
        return rows;
    });
}

// GET ARTICLE & QUERY DEFINED
exports.selectArticles = (topic, sort_by="created_at", order="desc") => {

    const validSortBy = ['title' ,'topic' ,'author' ,'body', 'created_at','votes' ,'article_img_url']

    if (!validSortBy.includes(sort_by))
      return Promise.reject({status: 400, message: 'invalid query value'})


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

    if (!['asc', 'desc'].includes(order))
    return Promise.reject({status: 400, message: 'invalid sort order'})
    
    const values = [];
    
    if (topic) {
        query += ` WHERE articles.topic = $1`;
        values.push(topic);
    }
    
    query += ` GROUP BY articles.article_id 
    ORDER BY ${sort_by} ${order};`;
    
    return db
    .query(query, values)
    .then(({ rows }) => {
        console.log(rows)
        return rows;
    });
}

// GET ARTICLE BY ID
exports.selectArticlesById = (article_id) => {

    return db
    .query(`SELECT articles.*, COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`, [article_id])
    .then(({ rows:articles }) =>{
        return articles[0];
    })   
}

// CHECK ARTICLE EXIST
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

// UPDATE ARTICLE BY ID
exports.updateArticleByArticleId = (article_id, inc_votes) => {
    const sqlUpdateString = format(`UPDATE articles SET votes = votes + %L WHERE article_id = %L RETURNING *;`, inc_votes, article_id)
    return db.query(sqlUpdateString)
    .then(({ rows:update }) => {
        return update[0];
    })
}

// GET COMMENT BY ARTICLE ID
exports.selectCommentsByArticleId = (article_id) => {
    return db
    .query(`SELECT * FROM comments WHERE article_id=$1;`, [article_id])
    .then(({ rows:comments }) =>{
        return comments;
    })
}

// POST COMMENT BY ARTICLE ID
exports.insertCommentByArticleId = (newComment) => {
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

// DELETE COMMENT BY ID
exports.deleteCommentByCommentId = (comment_id) => {
    return db
    .query('DELETE FROM comments WHERE comment_id = $1', [comment_id]);
}

// GET USERS
exports.selectUsers = () =>{
    return db
    .query("SELECT * FROM users;").then(({ rows }) => {
        return rows;
    });
}

