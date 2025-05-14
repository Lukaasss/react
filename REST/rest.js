const express = require("express");
const mysql = require("mysql2");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const util = require("util");
const usersRouter = require("./routes/users");

const Ajv = require("ajv");
const ajv = new Ajv();

// Person Schema definieren
const personSchema = {
    type: "object",
    required: ["vorname", "nachname", "plz", "strasse", "ort", "telefonnummer", "email"],
    properties: {
        vorname: { type: "string" },
        nachname: { type: "string" },
        plz: { type: "string" },
        strasse: { type: "string" },
        ort: { type: "string" },
        telefonnummer: { type: "string" },
        email: { type: "string" }
    },
};

// Validator Funktion
const validatePerson = ajv.compile(personSchema);

dotenv.config();
const app = express();
const port = 3000;

app.use(express.json());
app.use("/users", usersRouter);

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

const query = util.promisify(db.query).bind(db);

db.connect((err) => {
    if (err) {
        console.error("Datenbankverbindung fehlgeschlagen:", err);
        process.exit(1);
    }
    console.log("Mit MySQL verbunden!");
});

// Authentifizierungstoken-Middleware
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

// ALLE PERSONEN
app.get("/person", authenticateToken, (req, res) => {
    db.query("SELECT * FROM person", (err, results) => {
        if (err) return res.status(500).send("Fehler beim Abrufen der Personen");
        res.status(200).json(results);
    });
});

// EINE PERSON
app.get("/person/:id", authenticateToken, (req, res) => {
    const { id } = req.params;
    db.query("SELECT * FROM person WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).send("Fehler beim Abrufen der Person");
        if (result.length === 0) return res.status(404).send("Person nicht gefunden");
        res.status(200).json(result[0]);
    });
});

// PERSON HINZUFÜGEN
app.post("/person", authenticateToken, (req, res) => {
    const isValid = validatePerson(req.body);
    if (!isValid) {
        return res.status(400).json({ message: "Ungültige Daten", errors: validatePerson.errors });
    }

    const { vorname, nachname, plz, strasse, ort, telefonnummer, email } = req.body;
    const sql = `
        INSERT INTO person (vorname, nachname, plz, strasse, ort, telefonnummer, email)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [vorname, nachname, plz, strasse, ort, telefonnummer, email];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Fehler beim Einfügen der Person:", err);
            return res.status(500).send("Fehler beim Speichern der Person");
        }
        res.status(201).send({ message: "Person hinzugefügt", id: result.insertId });
    });
});

// PERSON BEARBEITEN
app.put("/person/:id", authenticateToken, (req, res) => {
    const { id } = req.params;
    const isValid = validatePerson(req.body);
    if (!isValid) {
        return res.status(400).json({ message: "Ungültige Daten", errors: validatePerson.errors });
    }

    const { vorname, nachname, plz, strasse, ort, telefonnummer, email } = req.body;
    const sql = `
        UPDATE person
        SET vorname = ?, nachname = ?, plz = ?, strasse = ?, ort = ?, telefonnummer = ?, email = ?
        WHERE id = ?
    `;
    const values = [vorname, nachname, plz, strasse, ort, telefonnummer, email, id];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Fehler beim Aktualisieren der Person:", err);
            return res.status(500).send("Fehler beim Aktualisieren der Person");
        }
        if (result.affectedRows === 0) {
            return res.status(404).send("Person nicht gefunden");
        }
        res.status(200).send("Person aktualisiert");
    });
});

// PERSON LÖSCHEN
app.delete("/person/:id", authenticateToken, (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM person WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).send("Fehler beim Löschen der Person");
        if (result.affectedRows === 0) return res.status(404).send("Person nicht gefunden");
        res.status(200).send("Person gelöscht");
    });
});

// SERVER STARTEN
app.listen(port, () => {
    console.log(`Server läuft unter http://localhost:${port}`);
});
