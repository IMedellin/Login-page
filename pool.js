const { Pool } = require("pg");
require('dotenv').config();
const HOST = process.env.HOST;
const USER = process.env.USER;
const DATABASE = process.env.DATABASE;

const pool = new Pool({
  "host": HOST,
  "port": 5432,
  "user": USER,
  "database": DATABASE
})

module.exports = pool;

