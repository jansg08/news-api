const request = require("supertest");
const db = require("../db/connection");
const data = require("../db/data/test-data/");
const seed = require("../db/seeds/seed");
const app = require("../app");
const endpoints = require("../endpoints.json");

beforeEach(() => seed(data));
afterAll(() => db.end());

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
});

describe("/api", () => {
  describe("GET", () => {
    test("200: responds with json of all endpoints available", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => expect(body.endpoints).toEqual(endpoints));
    });
  });
});
