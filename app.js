const express = require("express");

const { getTopics } = require("./controllers/topics.controller");
const { handleServerErrors } = require("./error-handles");

const app = express();

app.get("/api/topics", getTopics);

app.use(handleServerErrors);

module.exports = app;
