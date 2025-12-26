require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
 user: process.env.DB_USER,
password: process.env.DB_PASSWORD,
host: process.env.DB_HOST,
database: process.env.DB_NAME,
port: process.env.DB_PORT,
});

module.exports = pool;

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("DB connection error:", err);
  } else {
    console.log("DB connected at:", res.rows[0]);
  }
});
