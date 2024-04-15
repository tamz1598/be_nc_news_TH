const request = require('supertest');
const app = require('../db/app');
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
    // get /api/topics
    describe('/api/topics', () => {
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

    describe('/api/', () => {
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

    describe('/api/articles/:article_id', () => {
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
    });
});