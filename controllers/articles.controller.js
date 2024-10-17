const {
  selectArticleById,
  selectArticles,
  selectCommentsByArticleId,
  insertCommentForArticleId,
  updateArticleVotes,
  insertArticle,
} = require("../models/articles.model");
const { selectUserByUsername } = require("../models/users.model");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  return selectArticleById(article_id)
    .then((article) => res.status(200).send({ article }))
    .catch((err) => next(err));
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic, limit, p } = req.query;
  return selectArticles(sort_by, order, topic, limit, p)
    .then((articlesWithCount) => {
      if (articlesWithCount.articles.length) {
        res.status(200).send(articlesWithCount);
      } else {
        res.status(204).send();
      }
    })
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

exports.postArticle = (req, res, next) => {
  const { body } = req;
  return insertArticle(body)
    .then((article) => res.status(201).send({ article }))
    .catch((err) => next(err));
};
