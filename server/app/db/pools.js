
const { Pool } = require('pg');
const config = require('./config');

const dotenv = require("dotenv");

dotenv.config();

//https://itnext.io/building-restful-api-with-node-js-express-js-and-postgresql-the-right-way-b2e718ad1c66

//postgres://{db_username}:{db_password}@{host}:{port}/{db_name}
//const databaseConfig = { connectionString: process.env.DATABASE_URL };
const pool = new Pool(config.db);

module.exports = pool;