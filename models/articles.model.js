const db = require("../db/connection");

exports.selectArticleById = (id) => {
  return db
    .query(
      `
      SELECT
        *
      FROM
        articles
      WHERE
        article_id = $1
      `,
      [id]
    )
    .then(
      ({ rows }) => rows[0] || Promise.reject({ code: 404, msg: "Not found" })
    );
};

exports.selectArticles = () => {
  return db
    .query(
      `
    SELECT
      articles.article_id,
      articles.author,
      title,
      topic,
      articles.created_at,
      articles.votes,
      article_img_url,
      COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments
      ON comments.article_id = articles.article_id
    GROUP BY
      articles.article_id
    ORDER BY
      created_at
     `
    )
    .then(({ rows }) =>
      rows.map((row) => {
        row.comment_count = Number.parseInt(row.comment_count);
        return row;
      })
    );
};

exports.selectCommentsByArticleId = (id) => {
  return db
    .query(
      `
      SELECT
        *
      FROM
        comments
      WHERE
        comments.article_id = $1
      `,
      [id]
    )
    .then(({ rows }) => rows);
};

exports.insertCommentForArticleId = (id, comment) => {
  const commentFormat = [
    ["body", "string"],
    ["username", "string"],
  ];
  if (!Object.keys(comment).length) {
    return Promise.reject({ code: 400, msg: "Bad request" });
  }
  if (!commentFormat.every(([key, type]) => typeof comment[key] === type)) {
    return Promise.reject({ code: 422, msg: "Unprocessable entity" });
  }
  return db
    .query(
      `
      INSERT INTO
        comments (body, author, votes, created_at, article_id)
      VALUES
        ($1, $2, $3, $4, $5)
      RETURNING *;
      `,
      [comment.body, comment.username, 0, new Date(), id]
    )
    .then(({ rows }) => rows[0]);
};

exports.updateArticleVotes = (id, inc) => {
  return db
    .query(
      `
      UPDATE
        articles
      SET
        votes = votes + $1
      WHERE
        articles.article_id = $2
      RETURNING *;
      `,
      [inc, id]
    )
    .then(
      ({ rows }) => rows[0] || Promise.reject({ code: 404, msg: "Not found" })
    );
};