const db = require("../db/connection");
const data = require("../db/data/test-data/");
const seed = require("../db/seeds/seed");
const { articlesTest } = require("../api-tests/articles");
const { commentsTest } = require("../api-tests/comments");
const { usersTest } = require("../api-tests/users");
const { topicsTest } = require("../api-tests/topics");
const { endpointsTest } = require("../api-tests/endpoints");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("run all router test", () => {
  articlesTest();
  commentsTest();
  usersTest();
  topicsTest();
  endpointsTest();
});
