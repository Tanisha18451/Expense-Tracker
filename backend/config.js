const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",         // change if needed
    password: "RohitSharma#18", // change to your MySQL password
    database: "expense_tracker",
});

db.connect((err) => {
    if (err) {
        console.error("❌ Database connection failed:", err);
    } else {
        console.log("✅ Connected to MySQL database");
    }
});

module.exports = db;
