const mysql = require("mysql2");
const { promisify } = require("util");
const { database } = require("./keys");

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("error ñeri");
    }
    if (err.code === "ER_CON_COUNT_ERROR") {
      console.error("error");
    }
    if (err.code === "ECONNREFUSED") {
      console.error("error PERRO");
    }
  }
  if (connection) connection.release();
  console.log("DB is Connected");
  return;
});

pool.query = promisify(pool.query);
module.exports = pool;
