const express = require("express");

const { getTopics } = require("./controllers/topics.controller");
const {
  handleServerErrors,
  handleCustomErrors,
  handlePsqlErrors,
} = require("./error-handlers");
const { getEndpoints } = require("./controllers/endpoints.controller");
const { getArticleById } = require("./controllers/articles.controller");

const app = express();

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.use(handleServerErrors);

module.exports = app;
