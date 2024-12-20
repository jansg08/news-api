const db = require("../db/connection");
const format = require("pg-format");

exports.selectArticleById = (id) => {
  return db
    .query(
      `
      SELECT
        articles.article_id,
        articles.author,
        articles.body,
        title,
        topic,
        articles.created_at,
        articles.votes,
        article_img_url,
        COUNT(comments.comment_id) AS comment_count
      FROM
        articles
      LEFT JOIN comments
        ON comments.article_id = articles.article_id
      WHERE
        articles.article_id = $1
      GROUP BY
        articles.article_id;
      `,
      [id]
    )
    .then(({ rows }) => {
      if (rows[0]) {
        rows[0].comment_count = Number.parseInt(rows[0].comment_count);
        return rows[0];
      }
      return Promise.reject({ code: 404, msg: "Not found" });
    });
};

exports.selectArticles = (
  sort_by = "created_at",
  order = "DESC",
  topic = "%%",
  limit = 10,
  p = 1
) => {
  return db
    .query(
      `
    SELECT
      slug
    FROM
      topics;
    `
    )
    .then(({ rows }) => {
      const validTopics = ["%%", ...rows.map(({ slug }) => slug)];
      if (!validTopics.includes(topic)) {
        return Promise.reject({ code: 400, msg: "Bad request" });
      }
      const countQuery = db.query(
        format(
          `
          SELECT
            COUNT(*)
          FROM
            articles
          WHERE
            topic LIKE %L;
          `,
          topic,
          sort_by,
          order,
          limit,
          (p - 1) * limit
        )
      );
      const articlesQuery = db.query(
        format(
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
        FROM
          articles
        LEFT JOIN comments
          ON comments.article_id = articles.article_id
        WHERE
          topic LIKE %L
        GROUP BY
          articles.article_id
        ORDER BY
          %I %s
        LIMIT
          %L
        OFFSET
          %L;
        `,
          topic,
          sort_by,
          order,
          limit,
          (p - 1) * limit
        )
      );
      return Promise.all([countQuery, articlesQuery]);
    })
    .then(([countResult, articlesResult]) => {
      return {
        articles: articlesResult.rows.map((row) => {
          row.comment_count = Number.parseInt(row.comment_count);
          return row;
        }),
        total_count: Number(countResult.rows[0].count),
      };
    });
};

exports.selectCommentsByArticleId = (id, limit = 10, p = 1) => {
  return db
    .query(
      `
      SELECT
        *
      FROM
        comments
      WHERE
        comments.article_id = $1
      ORDER BY
        created_at
      LIMIT
        $2
      OFFSET
        $3;
      `,
      [id, limit, (p - 1) * limit]
    )
    .then(({ rows }) => rows);
};

exports.insertCommentForArticleId = (id, comment) => {
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

exports.insertArticle = ({ title, body, author, topic, article_img_url }) => {
  const insertArr = [title, body, author, topic];
  let addUrlColumn = "";
  if (article_img_url) {
    insertArr.push(article_img_url);
    addUrlColumn = ", article_img_url";
  }
  return db
    .query(
      format(
        `
        INSERT INTO
          articles (title, body, author, topic${addUrlColumn})
        VALUES
          %L
        RETURNING *;
        `,
        [insertArr]
      )
    )
    .then(({ rows }) => {
      const rowWithCommentCount = { ...rows[0] };
      rowWithCommentCount.comment_count = 0;
      return rowWithCommentCount;
    });
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

exports.removeArticleById = (id) => {
  return db
    .query(
      `
      DELETE FROM
        comments
      WHERE
        article_id = $1;
      `,
      [id]
    )
    .then(() =>
      db.query(
        `
        DELETE FROM
          articles
        WHERE
          article_id = $1
        RETURNING *;
        `,
        [id]
      )
    )
    .then(
      ({ rows }) => rows[0] || Promise.reject({ code: 404, msg: "Not found" })
    );
};
