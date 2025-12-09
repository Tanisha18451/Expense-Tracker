const db = require("../config");
const bcrypt = require("bcryptjs");

// ✅ Signup Controller
exports.signup = (req, res) => {
    const { username, email, password } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 10);

    db.query(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [username, email, hashedPassword],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error signing up");
            }
            res.send("Signup successful");
        }
    );
};

// ✅ Login Controller
exports.login = (req, res) => {
    const { username, email, password } = req.body;

    // Allow login using either username or email
    db.query(
        "SELECT * FROM users WHERE username = ? OR email = ?",
        [username, email],
        (err, results) => {
            if (err) return res.status(500).send("Error logging in");
            if (results.length === 0) return res.status(401).send("User not found");

            const user = results[0];
            const isPasswordValid = bcrypt.compareSync(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).send("Invalid password");
            }

            res.send({ message: "Login successful", username: user.username });
        }
    );
};
