const {
  selectArticleById,
  selectArticles,
  selectCommentsByArticleId,
  insertCommentForArticleId,
  updateArticleVotes,
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
  const id = req.params.article_id;
  return Promise.all([selectArticleById(id), selectCommentsByArticleId(id)])
    .then(([article, comments]) => {
      if (comments.length) {
        res.status(200).send({ comments });
      } else {
        res.status(204).send();
      }
    })
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

exports.patchArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  return updateArticleVotes(article_id, inc_votes)
    .then((article) => res.status(200).send({ article }))
    .catch((err) => next(err));
};
