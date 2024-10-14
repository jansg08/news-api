exports.handleServerErrors = (err, req, res, next) =>
  res.status(500).send({ msg: "Internal server error" });

exports.handleCustomErrors = (err, req, res, next) =>
  err.code && err.msg ? res.status(err.code).send({ msg: err.msg }) : next(err);

exports.handlePsqlErrors = (err, req, res, next) =>
  err.code ? res.status(400).send({ msg: "Bad request" }) : next(err);
