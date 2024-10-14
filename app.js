const express = require("express");

const { getTopics } = require("./controllers/topics.controller");
const { handleServerErrors } = require("./error-handles");
const { getEndpoints } = require("./controllers/endpoints.controller");

const app = express();

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.use(handleServerErrors);

module.exports = app;
