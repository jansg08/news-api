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

describe("/api/articles/:article_id", () => {
  describe("GET", () => {
    test("200: responds with article object with all relevant properties and matching the given id", () => {
      return request(app)
        .get("/api/articles/6")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toMatchObject({
            article_id: 6,
            title: "A",
            topic: "mitch",
            author: "icellusedkars",
            body: "Delicious tin of cat food",
            created_at: "2020-10-18T01:00:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });
    test("200: responds with an articles object including the comment_count key equalling the total comments for that article", () => {
      return request(app)
        .get("/api/articles/5")
        .expect(200)
        .then(({ body }) => {
          expect(body.article.comment_count).toBe(2);
        });
    });
    test("404: responds with 'Not found' when provided with a valid but non-existent id", () => {
      return request(app)
        .get("/api/articles/145")
        .expect(404)
        .then(({ body }) => expect(body.msg).toBe("Not found"));
    });
    test("400: responds with 'Bad request' when provided with an invalid id", () => {
      return request(app)
        .get("/api/articles/yellow")
        .expect(400)
        .then(({ body }) => expect(body.msg).toBe("Bad request"));
    });
  });
  describe("PATCH", () => {
    test("200: updates votes for given article id by given increment and servers newly updated article", () => {
      return request(app)
        .patch("/api/articles/6")
        .send({ inc_votes: 50 })
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toEqual({
            article_id: 6,
            title: "A",
            topic: "mitch",
            author: "icellusedkars",
            body: "Delicious tin of cat food",
            created_at: "2020-10-18T01:00:00.000Z",
            votes: 50,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });
    test("404: responds with 'Not found' when provided with a valid but non-existent id", () => {
      return request(app)
        .patch("/api/articles/145")
        .send({ inc_votes: 50 })
        .expect(404)
        .then(({ body }) => expect(body.msg).toBe("Not found"));
    });
    test("400: responds with 'Bad request' when provided with an invalid id", () => {
      return request(app)
        .patch("/api/articles/yellow")
        .send({ inc_votes: 50 })
        .expect(400)
        .then(({ body }) => expect(body.msg).toBe("Bad request"));
    });
    test("400: responds with 'Bad request' when provided with an invalid request body", () => {
      const assertion1 = request(app)
        .patch("/api/articles/yellow")
        .send()
        .expect(400)
        .then(({ body }) => expect(body.msg).toBe("Bad request"));
      const assertion2 = request(app)
        .patch("/api/articles/yellow")
        .send({ inc_votes: "barney" })
        .expect(400)
        .then(({ body }) => expect(body.msg).toBe("Bad request"));
      return Promise.all([assertion1, assertion2]);
    });
  });
});

describe("/api/articles", () => {
  describe("GET", () => {
    test("200: responds with an array of all article objects without their body property", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).toBe(13);
          body.articles.forEach((article) => {
            expect(article).not.toHaveProperty("body");
            expect(typeof article.author).toBe("string");
            expect(typeof article.title).toBe("string");
            expect(typeof article.article_id).toBe("number");
            expect(typeof article.topic).toBe("string");
            expect(typeof article.created_at).toBe("string");
            expect(typeof article.votes).toBe("number");
            expect(typeof article.article_img_url).toBe("string");
            expect(typeof article.comment_count).toBe("number");
          });
        });
    });
    test("200: responds with an array of article object including a comment_count equalling the total comments for that article", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[6].comment_count).toBe(11);
        });
    });
    test("200: responds with an array of article objects sorted by date in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("created_at", {
            descending: true,
            coerce: true,
          });
        });
    });
    describe("sort_by query", () => {
      test("200: responds with an array sorted by the column provided by the sort_by query", () => {
        return request(app)
          .get("/api/articles?sort_by=votes")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).toBeSortedBy("votes", {
              descending: true,
            });
          });
      });
      test("400: responds with 'Bad request' when an invalid column name is given for the sort_by query", () => {
        return request(app)
          .get("/api/articles?sort_by=name")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad request");
          });
      });
    });
    describe("order query", () => {
      test("200: responds with an array sorted by the column provided by the sort_by query and in the direction provided by the order query", () => {
        return request(app)
          .get("/api/articles?sort_by=votes&order=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).toBeSortedBy("votes", {
              descending: false,
            });
          });
      });
      test("400: responds with 'Bad request' when an invalid value is given for the order query", () => {
        return request(app)
          .get("/api/articles?order=random")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad request");
          });
      });
    });
    describe("topic query", () => {
      test("200: responds with an array of articles filtered by the topic provided by the topic query", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(({ body }) => {
            body.articles.forEach(({ topic }) => expect(topic).toBe("mitch"));
          });
      });
      test("204: responds with no content when provided with valid topic value but no articles are available for it", () => {
        return request(app).get("/api/articles?topic=paper").expect(204);
      });
      test("400: responds with 'Bad request' when an invalid topic is given for the topic query", () => {
        return request(app)
          .get("/api/articles?topic=tutorials")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad request");
          });
      });
    });
  });
});

describe("/api/articles/:article_id/comments", () => {
  describe("GET", () => {
    test("200: responds with array of comments attached to the article matching the given article id", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments.length).toBe(11);
          body.comments.forEach((comment) => {
            expect(typeof comment.author).toBe("string");
            expect(typeof comment.body).toBe("string");
            expect(typeof comment.comment_id).toBe("number");
            expect(typeof comment.article_id).toBe("number");
            expect(typeof comment.created_at).toBe("string");
            expect(typeof comment.votes).toBe("number");
          });
        });
    });
    test("200: responds with array of comments sorted by date in descending order", () => {
      return request(app)
        .get("/api/articles/5/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toBeSortedBy("created_at", {
            descending: true,
            coerce: true,
          });
        });
    });
    test("204: responds with empty body when given a valid article id but not comments are available for it", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(204)
        .then(({ body }) => {
          expect(body).toEqual({});
        });
    });
    test("404: responds with 'Not found' when provided with a valid but non-existent id", () => {
      return request(app)
        .get("/api/articles/145/comments")
        .expect(404)
        .then(({ body }) => expect(body.msg).toBe("Not found"));
    });
    test("400: responds with 'Bad request' when provided with an invalid id", () => {
      return request(app)
        .get("/api/articles/yellow/comments")
        .expect(400)
        .then(({ body }) => expect(body.msg).toBe("Bad request"));
    });
  });
  describe("POST", () => {
    test("201: inserts given comment in the database with the given article id and responds with newly created row", () => {
      return request(app)
        .post("/api/articles/3/comments")
        .send({
          body: " I carry a log — yes. Is it funny to you? It is not to me.",
          username: "icellusedkars",
        })
        .expect(201)
        .then(({ body }) => {
          expect(body.comment.comment_id).toBe(19);
          expect(body.comment.article_id).toBe(3);
          expect(body.comment.votes).toBe(0);
          expect(typeof body.comment.created_at).toBe("string");
          expect(body.comment.author).toBe("icellusedkars");
          expect(body.comment.body).toBe(
            " I carry a log — yes. Is it funny to you? It is not to me."
          );
        });
    });
    test("201: inserts given comment regardless of any extra properties in the request body", () => {
      return request(app)
        .post("/api/articles/3/comments")
        .send({
          body: " I carry a log — yes. Is it funny to you? It is not to me.",
          username: "icellusedkars",
          type: "suggestion",
          votes: 4,
        })
        .expect(201)
        .then(({ body }) => {
          expect(body.comment.comment_id).toBe(19);
          expect(body.comment.article_id).toBe(3);
          expect(body.comment.votes).toBe(0);
          expect(typeof body.comment.created_at).toBe("string");
          expect(body.comment.author).toBe("icellusedkars");
          expect(body.comment.body).toBe(
            " I carry a log — yes. Is it funny to you? It is not to me."
          );
        });
    });
    test("404: responds with 'Not found' when provided with a valid but non-existent id", () => {
      return request(app)
        .post("/api/articles/145/comments")
        .send({
          body: " I carry a log — yes. Is it funny to you? It is not to me.",
          username: "icellusedkars",
        })
        .expect(404)
        .then(({ body }) => expect(body.msg).toBe("Not found"));
    });
    test("400: responds with 'Bad request' when provided with an invalid id", () => {
      return request(app)
        .post("/api/articles/yellow/comments")
        .send({
          body: " I carry a log — yes. Is it funny to you? It is not to me.",
          username: "icellusedkars",
        })
        .expect(400)
        .then(({ body }) => expect(body.msg).toBe("Bad request"));
    });
    test("400: responds with 'Bad request' when provided with an empty request body", () => {
      return request(app)
        .post("/api/articles/5/comments")
        .send()
        .expect(400)
        .then(({ body }) => expect(body.msg).toBe("Bad request"));
    });
    test("400: responds with 'Bad request' when request body is sent in the incorrect format", () => {
      return request(app)
        .post("/api/articles/5/comments")
        .send({
          body: " I carry a log — yes. Is it funny to you? It is not to me.",
        })
        .expect(400)
        .then(({ body }) => expect(body.msg).toBe("Bad request"));
    });
  });
});

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
