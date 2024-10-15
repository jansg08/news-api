const { selectUsers, selectUserByUsername } = require("../models/users.model");

exports.getUsers = (req, res, next) => {
  return selectUsers()
    .then((users) => res.status(200).send({ users }))
    .catch((err) => next(err));
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  return selectUserByUsername(username)
    .then((user) => res.status(200).send({ user }))
    .catch((err) => next(err));
};
