const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');

const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data');

beforeEach(() => {
  return seed(data);
})

afterAll(() => {
  return db.end();
})


describe("NC_NEWS", () => {
    // /api/
    describe('/api/', () => {
        // task 3
        test('GET 200: Responds with an object describing all the available endpoints on your API', () => {
            return request(app)
            .get('/api/')
            .expect(200)
            .then(({body}) =>{
                const { endpoint } = body;
                expect(endpoint).toBe(endpoint);
            });
        });
    })
    // GET /api/topics
    describe('/api/topics', () => {
        // task 2
        test('GET 200: Responds with an array of topic object containing the following properties: slug and description.', () => {
            return request(app)
              .get('/api/topics')
              .expect(200)
              .then(({ body }) => {
                const { topics } = body;
                expect(topics).toHaveLength(3);
      
                topics.forEach(topic => {
                  expect(typeof topic.description).toBe('string');
                  expect(typeof topic.slug).toBe('string');
                });
            });
        });

        test("GET 404: Responds with an error if passed a wrong path or non-existent endpoint.", () => {
            return request(app)
              .get('/api/topics!')
              .expect(404)
              .then(({ body }) => {
                const { message } = body; 
                expect(message).toBe('endpoint not found');
            });
        });
    });
    // GET /api/articles
    describe('/api/articles', () => {
      // task 5
      test("GET 200: Responds with an array of articles of article objects, with comment.", () => {
          return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
              const { articles } = body;
              expect(articles).toHaveLength(13);

                articles.forEach(article => {
                expect(typeof article.article_id).toBe('number');
                expect(typeof article.title).toBe('string');
                expect(typeof article.topic).toBe('string');
                expect(typeof article.author).toBe('string');
                expect(typeof article.created_at).toBe('string');
                expect(typeof article.votes).toBe('number');
                expect(typeof article.article_img_url).toBe('string');
                expect(typeof article.comment_count).toBe('string');
                });
          });
      });

      test("GET 200: Responds with an array of articles of article objects, with comment and in descending order.", () => {
          return request(app)
            .get('/api/articles?order=desc')
            .expect(200)
            .then(({ body }) => {
              const { articles } = body;
              expect(articles).toBeSortedBy('created_at', {descending: true });
          });
      });
  
      // task 11
      test("GET 200: Dependant on topic, respond with all articles related to that topic.", () => {
          return request(app)
          .get('/api/articles?topic=cats')
          .expect(200)
          .then(({ body }) => {
              const { articles } = body;
                expect(articles.length).toBe(1);
                  articles.forEach((article) => {
                    expect(article.topic).toBe('cats')
                    })
          });
      });

      test("GET 200: Querying for a topic that is empty.", () => {
          return request(app)
            .get('/api/articles?topic=paper')
            .expect(200)
            .then(({ body }) => {
              const { articles } = body;
                expect(Array.isArray(articles)).toBe(true);
                expect(articles.length).toBe(0);
          });
      });

      test("GET 404: Querying for a topic that does not exist.", () => {
          return request(app)
            .get('/api/articles?topic=banana')
            .expect(404)
            .then(({ body: { message } }) => {
              expect(message).toBe('Topic not found');
          });
      });

      // task 15
      test("GET 200: FEATURE REQUEST Responds with sorting queries.", () => {
          return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body }) => {
              const { articles } = body;
                expect(articles).toBeSortedBy('created_at', {descending: true });
              })
      });

      test("GET 200: FEATURE REQUEST Responds with sorting queries.", () => {
          return request(app)
          .get('/api/articles?sort_by=author')
          .expect(200)
          .then(({ body }) => {
              const { articles } = body;
                expect(articles).toBeSortedBy('author', {descending: true });
          })
      });

      test("GET 400: Responds with an error if passed an invalid sort order.", () => {
          return request(app)
            .get('/api/articles?order=banana')
            .expect(400)
            .then(({ body: { message } }) => {
              expect(message).toBe('invalid sort order');
          });
      });

      test("GET 400: Responds with an error if passed an invalid sort order.", () => {
          return request(app)
            .get('/api/articles?sort_by=something')
            .expect(400)
            .then(({ body: { message } }) => {
              expect(message).toBe('invalid query value');
          });
      });

      // task 19
      test("POST 201: Add a new article to articles and return that comment.", () => {
        return request(app)
          .post('/api/articles')
          .send({
            title: "The courting of a heart",
            topic: "cats",
            author: "icellusedkars",
            body: "Helllo",
            article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          })
          .expect(201)
          .then(({ body }) => {
            const { articles } = body;
            expect(articles).toMatchObject({
            article_id: 14,
            title: "The courting of a heart",
            topic: "cats",
            author: "icellusedkars",
            body: "Helllo",
            article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
            });
          });
        });
    });
   
    // /api/articles/:article_id
    describe('/api/articles/:article_id', () => {
        //task 4
        test("GET 200: Responds with getting an article by its id.", () => {
            return request(app)
              .get('/api/articles/1')
              .expect(200)
              .then(({ body }) => {
                const { articles } = body;
                  expect(articles.article_id).toBe(1);
                  expect(articles.title).toBe('Living in the shadow of a great man');
                  expect(articles.topic).toBe('mitch');
                  expect(articles.author).toBe('butter_bridge');
                  expect(articles.body).toBe('I find this existence challenging');
                  expect(typeof articles.created_at).toBe('string');
                  expect(articles.votes).toBe(100);
                  expect(articles.article_img_url).toBe('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700');
            });
        });

        test("GET 404: Responds with an error if an id that does not exist is passed.", () => {
            return request(app)
              .get('/api/articles/105')
              .expect(404)
              .then(({ body: { message } }) => {
                expect(message).toBe('article id not found');
                });
        });
      

       // task 8
        test("PATCH 202: Responds with an updated article.", () => {
           return request(app)
           .patch('/api/articles/1')
           .send({inc_votes: 5})
           .expect(202)
           .then(({ body }) => {
               const { update } = body;
               expect(update).toMatchObject({
               article_id: 1,
               title: "Living in the shadow of a great man",
               topic: "mitch",
               author: "butter_bridge",
               body: "I find this existence challenging",
               created_at: expect.any(String),
               votes: 105,
               article_img_url:
               "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
               });
           });
        }); 
       
        test("GET 400: Bad request of increments in vote.", () => {
           return request(app)
             .patch('/api/articles/1')
             .send({inc_votes: 'hello'})
             .expect(400)
             .then(({ body: { message } }) => {
               expect(message).toBe('This is a bad request, invalid format or votes is missing.');
           });
        });

        // task 12
        test("GET 200: FEATURE REQUEST Responds with getting an article by its id, with the comment count added.", () => {
            return request(app)
              .get('/api/articles/1')
              .expect(200)
              .then(({ body }) => {
                const { articles } = body;
                  expect(articles.article_id).toBe(1);
                  expect(articles.title).toBe('Living in the shadow of a great man');
                  expect(articles.topic).toBe('mitch');
                  expect(articles.author).toBe('butter_bridge');
                  expect(articles.body).toBe('I find this existence challenging');
                  expect(typeof articles.created_at).toBe('string');
                  expect(articles.votes).toBe(100);
                  expect(articles.article_img_url).toBe('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700');
                  expect(articles.comment_count).toBe('11');
            });
        });
    
    });
    
    describe('/api/articles/:article_id/comments', () => {
        // task 6
        test('GET 200: Responds with an array of comments for the given article_id', () => {
            return request(app)
              .get('/api/articles/3/comments')
              .expect(200)
              .then(({ body }) => {
                const { comments } = body;
                comments.forEach(comment => {
                  expect(typeof comment.comment_id).toBe('number');
                  expect(typeof comment.body).toBe('string');
                  expect(typeof comment.article_id).toBe('number');  
                  expect(typeof comment.author).toBe('string');
                  expect(typeof comment.votes).toBe('number');
                  expect(typeof comment.created_at).toBe('string');
              })
            });
        });

        // task 7
        test("POST 201: Add a new comment to an article and return that comment.", () => {
            return request(app)
              .post('/api/articles/3/comments')
              .send({
                username: "icellusedkars",
                body: "Brilliant code here"
              })
              .expect(201)
              .then(({ body }) => {
                const { comment } = body;
                expect(comment).toMatchObject({
                comment_id: 19,
                body: "Brilliant code here",
                article_id: 3,
                author: "icellusedkars",
                votes: 0,
                created_at: expect.any(String)
                });
              });
        });

        test("GET 400: Bad request of username.", () => {
            return request(app)
              .post('/api/articles/3/comments')
              .send({
                username: 70,
                body: "Brilliant code here"
              })
              .expect(400)
              .then(({ body: { message } }) => {
                expect(message).toBe('This is a bad request, please check your username.');
            });
        });

    });

    describe('/api/comments/:comment_id', () => {
        // task 9
        test("DELETE 204: delete the given comment by comment_id", () => {
            return request(app)
            .delete('/api/comments/4')
            .expect(204)
        });

        test("PATCH 202: Responds with an updated comment, update the votes on a comment given the comment's comment_id.", () => {
          return request(app)
          .patch('/api/comments/3')
          .send({inc_votes: 2})
          .expect(202)
          .then(({ body }) => {
              const { update } = body;
              expect(update).toMatchObject({
              comment_id: 3,
              body: "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
              votes: 102,
              author: "icellusedkars",
              article_id: 1,
              created_at: expect.any(String),
              });
          });
       }); 
    });

    describe('/api/users', () => {
        // task 10
        test('GET 200: Responds with an an array of objects of users.', () => {
            return request(app)
              .get('/api/users')
              .expect(200)
              .then(({ body }) => {
                const { users } = body;
                expect(users).toHaveLength(4);
      
                users.forEach(user => {
                  expect(typeof user.username).toBe('string');
                  expect(typeof user.name).toBe('string');
                  expect(typeof user.avatar_url).toBe('string');
                });
            });
        });
        
    });

    describe('/api/users/:username', () => {
      // task 17
      test("GET 200: Responds with getting an user by its id.", () => {
        return request(app)
          .get('/api/users/butter_bridge')
          .expect(200)
          .then(({ body }) => {
            const { users } = body;
              expect(users.username).toBe('butter_bridge');
              expect(users.name).toBe('jonny');
              expect(users.avatar_url).toBe('https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg');
            });
        });
        
        test("GET 404: Bad request of username.", () => {
          return request(app)
            .get('/api/users/hollow_tree')
            .expect(404)
            .then(({ body: { message } }) => {
              expect(message).toBe('user not found');
          });
      });
    });
});
