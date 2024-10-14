const {
  selectArticleById,
  selectArticles,
  selectCommentsByArticleId,
} = require("../models/articles.model");

exports.getArticleById = (req, res, next) => {
  return selectArticleById(req.params.article_id)
    .then((article) => res.status(200).send({ article }))
    .catch((err) => next(err));
};

exports.getArticles = (req, res, next) => {
  return selectArticles()
    .then((articles) => res.status(200).send({ articles }))
    .catch((err) => next(err));
};

exports.getCommentsByArticleId = (req, res, next) => {
  return selectCommentsByArticleId(req.params.article_id)
    .then((comments) => res.status(200).send({ comments }))
    .catch((err) => next(err));
};
