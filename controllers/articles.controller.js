const { selectArticleById } = require("../models/articles.model");

exports.getArticleById = (req, res, next) => {
  return selectArticleById(req.params.article_id)
    .then((article) => res.status(200).send({ article }))
    .catch((err) => next(err));
};
