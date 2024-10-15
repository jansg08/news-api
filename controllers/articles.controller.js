const {
  selectArticleById,
  selectArticles,
  selectCommentsByArticleId,
  insertCommentForArticleId,
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

exports.postCommentForArticleId = (req, res, next) => {
  const id = req.params.article_id;
  const newComment = req.body;
  return Promise.all([
    selectArticleById(id),
    insertCommentForArticleId(id, newComment),
  ])
    .then(([article, comment]) => res.status(201).send({ comment }))
    .catch((err) => next(err));
};
