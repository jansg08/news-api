const { getEndpoints } = require("../controllers/endpoints.controller");
const articlesRouter = require("./articles.router");
const commentsRouter = require("./comments.router");
const topicsRouter = require("./topics.router");
const usersRouter = require("./users.router");

const apiRouter = require("express").Router();

apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);

apiRouter.route("/").get(getEndpoints);

module.exports = apiRouter;
