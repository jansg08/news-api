const db = require("../db/connection");

exports.removeCommentById = (id) => {
  return db
    .query(
      `
    DELETE FROM
      comments
    WHERE
      comment_id = $1
    RETURNING *;
    `,
      [id]
    )
    .then(
      ({ rows }) => rows[0] || Promise.reject({ code: 404, msg: "Not found" })
    );
};
