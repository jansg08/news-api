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

exports.updateCommentVotes = (id, inc) => {
  return db
    .query(
      `
      UPDATE
        comments
      SET
        votes = votes + $1
      WHERE
        comments.comment_id = $2
      RETURNING *;
      `,
      [inc, id]
    )
    .then(({ rows }) => rows[0]);
};
