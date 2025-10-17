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

// Debug environment variables
console.log('🔍 Database config:', {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  database: process.env.DB_NAME || "jewelskart",
  port: process.env.DB_PORT || 3306,
  hasPassword: !!process.env.DB_PASSWORD
});

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "jewelskart",
  port: process.env.DB_PORT || 3306,
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  } else {
    console.log("✅ Connected to MySQL database!");
  }
});

export default db;
