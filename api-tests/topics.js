const request = require("supertest");
const db = require("../db/connection");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const app = require("../app");

exports.topicsTest = () =>
  describe("topics", () => {
    describe("/api/topics", () => {
      describe("GET", () => {
        test("200: responds with array of topic objects containing the slug and description properties", () => {
          return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({ body }) => {
              expect(body.topics.length).toBe(3);
              body.topics.forEach(({ description, slug }) => {
                expect(typeof description).toBe("string");
                expect(typeof slug).toBe("string");
              });
            });
        });
      });
      describe("POST", () => {
        const sampleTopic = {
          slug: "top10",
          description: "Top 10 lists",
        };
        test("201: inserts given topic in the database responds with newly created topic object", () => {
          return request(app)
            .post("/api/topics")
            .send(sampleTopic)
            .expect(201)
            .then(({ body }) => {
              const { topic } = body;
              expect(topic).toMatchObject({
                slug: "top10",
                description: "Top 10 lists",
              });
            });
        });
        test("201: inserts given topic regardless of any extra properties in the request body", () => {
          return request(app)
            .post("/api/topics")
            .send({
              ...sampleTopic,
              topic_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            })
            .expect(201)
            .then(({ body }) => {
              const { topic } = body;
              expect(topic).toMatchObject({
                slug: "top10",
                description: "Top 10 lists",
              });
            });
        });
        test("201: inserts given topic regardless of missing description property", () => {
          return request(app)
            .post("/api/topics")
            .send({
              slug: "review",
            })
            .expect(201)
            .then(({ body }) => {
              const { topic } = body;
              expect(topic).toMatchObject({
                slug: "review",
                description: null,
              });
            });
        });
        test("400: responds with 'Bad request' when provided with an empty request body", () => {
          return request(app)
            .post("/api/topics")
            .send()
            .expect(400)
            .then(({ body }) => expect(body.msg).toBe("Bad request"));
        });
        test("400: responds with 'Bad request' when request body is sent in the incorrect format", () => {
          return request(app)
            .post("/api/topics")
            .send({
              description: "Reviews or discusses a certain product",
            })
            .expect(400)
            .then(({ body }) => expect(body.msg).toBe("Bad request"));
        });
      });
    });
  });
