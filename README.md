# Northcoders News API

Instructions:
- env. files will need to be added -->
  .env.development and .env.test
  Inside those files call the database.

  .env.development
  ==> PGDATABASE=nameOfDatabase

  .env.test
  ==> PGDATABASE=nameOfDatabase_test

-----------------------------------
- A link to the hosted version: https://be-nc-news-th.onrender.com

- Summary:
The project itself is an API for the purpose of accessing application data programmatically.

- Install the following:

  DevDependencies:
  Jest --> npm i jest -D 
  Jest sorted --> npm install --save-dev jest-sorted -D
  NOTE: For Jest sorted look at documentation for set-up
  Nodemon --> npm i --save-dev nodemon
  Husky --> npm i --save-dev husky

  Dependencies:
  Express --> pm i express --save
  PG --> npm i pg
  pg-format --> npm i pg-format

  - Versions:
  Node --> v21.6.2
  PostGress --> 16.2

