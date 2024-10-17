const {
  getArticleById,
  patchArticleVotes,
  getArticles,
  getCommentsByArticleId,
  postCommentForArticleId,
  postArticle,
} = require("../controllers/articles.controller");

const articlesRouter = require("express").Router();

articlesRouter.route("/").get(getArticles).post(postArticle);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleVotes);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentForArticleId);

module.exports = articlesRouter;
