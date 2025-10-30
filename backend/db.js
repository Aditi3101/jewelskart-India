// // db.js
// const mysql = require("mysql");
// const dotenv = require("dotenv");

// dotenv.config();

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",          // or use process.env.DB_PASSWORD if stored in .env
//   database: "ecommerce",
// });

// db.connect((err) => {
//   if (err) {
//     console.error("❌ Database connection failed:", err);
//     process.exit(1);
//   } else {
//     console.log("✅ Connected to MySQL database!");
//   }
// });

// module.exports = db;

// db.js
import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

// Make the connection test async-compatible
const testConnection = async () => {
  try {
    const [rows] = await db.promise().execute('SELECT 1 as test');
    console.log("✅ Connected to MySQL database!");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    console.log("⚠️ Server will continue without database connection");
  }
};

// Debug environment variables
console.log('🔍 Database config:', {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  database: process.env.DB_NAME || "jewelskart",
  port: process.env.DB_PORT || 3306,
  hasPassword: !!process.env.DB_PASSWORD
});

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "jewelskart",
  port: process.env.DB_PORT || 3306,
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0
});

// Test database connection
testConnection();

export default db;
