const request = require("supertest");
const db = require("../db/connection");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const app = require("../app");

exports.usersTest = () =>
  describe("users", () => {
    describe("/api/users", () => {
      describe("GET", () => {
        test("200", () => {
          return request(app)
            .get("/api/users")
            .expect(200)
            .then(({ body }) => {
              expect(body.users.length).toBe(4);
              body.users.forEach((user) => {
                expect(typeof user.name).toBe("string");
                expect(typeof user.username).toBe("string");
                expect(typeof user.avatar_url).toBe("string");
              });
            });
        });
      });
    });

    describe("/api/users/:username", () => {
      describe("GET", () => {
        test("200: responds with user object with the given username", () => {
          return request(app)
            .get("/api/users/rogersop")
            .expect(200)
            .then(({ body }) =>
              expect(body.user).toMatchObject({
                username: "rogersop",
                name: "paul",
                avatar_url:
                  "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
              })
            );
        });
        test("404: responds with 'Not found' when provided with a valid but non-existent username", () => {
          return request(app)
            .get("/api/users/nemo252")
            .expect(404)
            .then(({ body }) => expect(body.msg).toBe("Not found"));
        });
      });
    });
  });
