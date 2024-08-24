var mysql = require("mysql2");
require("dotenv").config();

var con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
const insertLog = async (log) => {
  // Connect to the database
  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
  });

  // Define the SQL query with a placeholder for parameters
  const sql = "INSERT INTO logs (req) VALUES (?)";

  // Use the query method with parameters
  con.query(sql, [log], (err, results) => {
    if (err) {
      console.error(err);
    } else {
      console.log(results);
    }
  });
};

const getAllLogs = async () => {
  return new Promise((resolve, reject) => {
    con.connect(function (err) {
      if (err) reject(err);
      console.log("Connected!");
    });
    con.execute("SELECT * FROM logs", (err, results) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = { insertLog, getAllLogs };
