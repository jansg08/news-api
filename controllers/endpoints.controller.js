const { readEndpoints } = require("../models/endpoints.model");

exports.getEndpoints = (req, res, next) => {
  return readEndpoints()
    .then((endpoints) => {
      res.status(200).send({ endpoints });
    })
    .catch((err) => next(err));
};
