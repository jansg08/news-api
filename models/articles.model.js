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
  return Promise.all([
    id,
    db.query(
      `
      SELECT 
        COUNT(*)
      FROM
        articles
      WHERE
        articles.article_id = $1
      `,
      [id]
    ),
  ])
    .then(([id, { rows }]) => {
      return Number.parseInt(rows[0].count)
        ? db.query(
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
        : Promise.reject({ code: 404, msg: "Not found" });
    })
    .then(({ rows }) => rows);
};
