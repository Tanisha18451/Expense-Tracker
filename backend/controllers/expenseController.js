const db = require("../config");

exports.getAll = (req, res) => {
    const username = req.params.username;
    db.query("SELECT * FROM expenses WHERE username = ?", [username], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
};

exports.add = (req, res) => {
    const { name, amount, category, date, username } = req.body;
    db.query(
        "INSERT INTO expenses (name, amount, category, date, username) VALUES (?, ?, ?, ?, ?)",
        [name, amount, category, date, username],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Expense added");
        }
    );
};

exports.update = (req, res) => {
    const { id } = req.params;
    const { name, amount, category, date } = req.body;
    db.query(
        "UPDATE expenses SET name=?, amount=?, category=?, date=? WHERE id=?",
        [name, amount, category, date, id],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Expense updated");
        }
    );
};

exports.remove = (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM expenses WHERE id=?", [id], (err) => {
        if (err) return res.status(500).send(err);
        res.send("Expense deleted");
    });
};
