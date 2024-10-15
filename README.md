# Northcoders News API

## About

This project serves relational data from a generic news platform in various formats. The app is written in JavaScript (Node.js), using the Express.js framework and the data is hosted in a PostgreSQL database. It's features full integration testing for every endpoint and robust error-handling for every requests.

## Demo

A functional demo of the project can be found [here](https://news-api-m05g.onrender.com/api/) hosted by Render and using Supabase to host the Postres database

Please note all endpoints start with /api

# Local Installation

To install and run this project locally:

1. Clone down the repo.
2. Run `npm i`.
3. Create a **.env.test** and **.env.development** file in the project's root directory to store database environment variables.
4. In each of the new files you've created, add the `PGDATABASE` environment variable at set the value to either `nc_news_test` for the test file or `nc_new` for the development file.
5. Run `npm run setup-dbs` to initialise the test and development databases.
6. Run `npm run seed` to populate the databse with all the tables and their data.
7. The server can then be started with `npm run start`.

This project is verified to work with Node.js v22.9.0+, npm v10.8.3+, and PostgreSQL v14.12+ 


--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
