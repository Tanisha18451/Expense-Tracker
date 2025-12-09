

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const connection = require("./config");// new added


const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/expenses", expenseRoutes);

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
// ======================= GET BUDGET =======================
app.get("/api/budget/:username", (req, res) => {
    const username = req.params.username;

    const sql = "SELECT budget FROM budgets WHERE username = ?";
    connection.query(sql, [username], (err, results) => {
        if (err) {
            console.error("DB error:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (results.length === 0) return res.json({ budget: 0 });

        res.json({ budget: results[0].budget });
    });
});
// ======================= SAVE/UPDATE BUDGET =======================
app.post("/api/budget", (req, res) => {
    const { username, budget } = req.body;

    if (!username || budget == null || isNaN(budget)) {
        return res.status(400).json({ error: "Invalid username or budget" });
    }

    const sql = `
        INSERT INTO budgets (username, budget)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE budget = VALUES(budget)
    `;

    connection.query(sql, [username, budget], (err, result) => {
        if (err) {
            console.error("DB error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ success: true, budget: parseFloat(budget) });
    });
});
