const db = require("../db/connection");

exports.selectUsers = () => {
  return db
    .query(
      `
    SELECT
      *
    FROM
      users;
    `
    )
    .then(({ rows }) => rows);
};

exports.selectUserByUsername = (username) => {
  return db
    .query(
      `
      SELECT
        *
      FROM
        users
      WHERE
        username = $1;
      `,
      [username]
    )
    .then(({ rows }) => {
      return rows[0] || Promise.reject({ code: 404, msg: "Not found" });
    });
};
