const db = require("../db/connection");
const format = require("pg-format");

exports.selectTopics = () =>
  db.query(`SELECT * FROM topics`).then(({ rows }) => rows);

exports.insertTopic = ({ slug, description }) => {
  return db
    .query(
      format(
        `
        INSERT INTO
          topics (slug, description)
        VALUES
          %L
        RETURNING *;
        `,
        [[slug, description]]
      )
    )
    .then(({ rows }) => rows[0]);
};
