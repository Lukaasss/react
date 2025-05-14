const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const mysql = require("mysql2");
const util = require("util");
require("dotenv").config();

// DB-Verbindung
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});
const query = util.promisify(db.query).bind(db);

// Auth-Middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Kein Token vorhanden" });

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Token ungültig" });
        req.user = user;
        next();
    });
}

// LOGIN
router.get("/login", (req, res) => {
    const { username, password } = req.query;
    const sql = "SELECT username, password FROM users WHERE username = ?";
    db.query(sql, [username], (err, results) => {
        if (err) return res.status(500).json({ message: "Datenbankfehler" });
        if (results.length === 0 || results[0].password !== password) {
            return res.status(409).json({ message: "Benutzername oder Passwort falsch" });
        }

        const token = jwt.sign({ username }, process.env.TOKEN_SECRET, { expiresIn: "1800s" });
        res.status(200).json({ message: "Login erfolgreich", token });
    });
});

// REGISTER
router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Username und Passwort erforderlich" });

    try {
        const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
        await query(sql, [username, password]);
        res.status(201).json({ message: "Benutzer erfolgreich registriert" });
    } catch (err) {
        console.error("Fehler bei Registrierung:", err);
        res.status(500).json({ message: "Fehler bei Registrierung" });
    }
});

module.exports = router;
