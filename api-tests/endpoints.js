const request = require("supertest");
const db = require("../db/connection");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const app = require("../app");
const endpoints = require("../endpoints.json");

exports.endpointsTest = () =>
  describe("endpoints", () => {
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
  });
