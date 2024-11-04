const express = require("express");
const cors = require("cors");
const apiRouter = require("./routers/api.router");

const {
  handleServerErrors,
  handleCustomErrors,
  handlePsqlErrors,
} = require("./error-handlers");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.use(handleServerErrors);

module.exports = app;
