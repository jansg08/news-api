const request = require("supertest");
const db = require("../db/connection");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const app = require("../app");

exports.commentsTest = () =>
  describe("comments", () => {
    describe("/api/comments/:comment_id", () => {
      describe("DELETE", () => {
        test("204: responds with empty body and deletes comment from database", () => {
          return request(app)
            .delete("/api/comments/5")
            .expect(204)
            .then(({ body }) => {
              return db.query(`SELECT * FROM comments WHERE comment_id = 5`);
            })
            .then(({ rows }) => {
              expect(rows).toEqual([]);
            });
        });
        test("404: responds with 'Not found' when provided with a valid but non-existent id", () => {
          return request(app)
            .delete("/api/comments/545")
            .expect(404)
            .then(({ body }) => expect(body.msg).toBe("Not found"));
        });
        test("400: responds with 'Bad request' when provided with an invalid id", () => {
          return request(app)
            .delete("/api/comments/yellow")
            .expect(400)
            .then(({ body }) => expect(body.msg).toBe("Bad request"));
        });
      });
      describe("PATCH", () => {
        test("200: updates votes for given comment id by given increment and servers newly updated comment", () => {
          return request(app)
            .patch("/api/comments/6")
            .send({ inc_votes: -15 })
            .expect(200)
            .then(({ body }) => {
              expect(body.comment).toEqual({
                comment_id: 6,
                body: "I hate streaming eyes even more",
                votes: -15,
                author: "icellusedkars",
                article_id: 1,
                created_at: "2020-04-11T21:02:00.000Z",
              });
            });
        });
        test("404: responds with 'Not found' when provided with a valid but non-existent id", () => {
          return request(app)
            .patch("/api/comments/145")
            .send({ inc_votes: 50 })
            .expect(404)
            .then(({ body }) => expect(body.msg).toBe("Not found"));
        });
        test("400: responds with 'Bad request' when provided with an invalid id", () => {
          return request(app)
            .patch("/api/comments/yellow")
            .send({ inc_votes: 50 })
            .expect(400)
            .then(({ body }) => expect(body.msg).toBe("Bad request"));
        });
        test("400: responds with 'Bad request' when provided with an invalid request body", () => {
          const assertion1 = request(app)
            .patch("/api/comments/yellow")
            .send()
            .expect(400)
            .then(({ body }) => expect(body.msg).toBe("Bad request"));
          const assertion2 = request(app)
            .patch("/api/comments/yellow")
            .send({ inc_votes: "barney" })
            .expect(400)
            .then(({ body }) => expect(body.msg).toBe("Bad request"));
          return Promise.all([assertion1, assertion2]);
        });
      });
    });
  });
