const express = require("express");
const mysql = require("mysql2");
const dotenv = require("dotenv");
const Ajv = require("ajv");

dotenv.config();

const app = express();
const port = 3000;

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error("Datenbankverbindung fehlgeschlagen:", err);
        process.exit(1);
    }
    console.log("Mit MySQL verbunden!");
});

app.use(express.json());

const ajv = new Ajv();
const personSchema = {
    type: "object",
    properties: {
        vorname: { type: "string" },
        nachname: { type: "string" },
        plz: { type: "string" },
        strasse: { type: "string" },
        ort: { type: "string" },
        telefonnummer: { type: "string" },
        email: { type: "string" }
    },
    required: ["vorname", "nachname", "email"],
    additionalProperties: false
};
const validatePerson = ajv.compile(personSchema);

app.post("/person", (req, res) => {
    const isValid = validatePerson(req.body);

    if (!isValid) {
        return res.status(400).json({
            message: "Ungültige Daten",
            errors: validatePerson.errors,
        });
    }

    const { vorname, nachname, plz, strasse, ort, telefonnummer, email } = req.body;
    const query = `
        INSERT INTO person (vorname, nachname, plz, strasse, ort, telefonnummer, email)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [vorname, nachname, plz, strasse, ort, telefonnummer, email];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error("Fehler beim Einfügen der Person:", err);
            return res.status(500).send("Fehler beim Speichern der Person");
        }
        res.status(201).send({ message: "Person hinzugefügt", id: result.insertId });
    });
});

app.put("/person/:id", (req, res) => {
    const { id } = req.params;
    const isValid = validatePerson(req.body);

    if (!isValid) {
        return res.status(400).json({
            message: "Ungültige Daten",
            errors: validatePerson.errors,
        });
    }

    const { vorname, nachname, plz, strasse, ort, telefonnummer, email } = req.body;
    const query = `
        UPDATE person
        SET vorname = ?, nachname = ?, plz = ?, strasse = ?, ort = ?, telefonnummer = ?, email = ?
        WHERE id = ?
    `;
    const values = [vorname, nachname, plz, strasse, ort, telefonnummer, email, id];

    db.query(query, values, (err, result) => {
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


app.get("/person", (req, res) => {
    db.query("SELECT * FROM person", (err, results) => {
        if (err) return res.status(500).send("Fehler beim Abrufen der Personen");
        res.status(200).json(results);
    });
});

app.get("/person/:id", (req, res) => {
    const { id } = req.params;
    db.query("SELECT * FROM person WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).send("Fehler beim Abrufen der Person");
        if (result.length === 0) return res.status(404).send("Person nicht gefunden");
        res.status(200).json(result[0]);
    });
});

app.delete("/person/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM person WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).send("Fehler beim Löschen der Person");
        if (result.affectedRows === 0) return res.status(404).send("Person nicht gefunden");
        res.status(200).send("Person gelöscht");
    });
});

app.listen(port, () => {
    console.log(`Server läuft unter http://localhost:${port}`);
});
