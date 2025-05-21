const express = require("express");
const mysql = require("mysql2");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const util = require("util");
const usersRouter = require("./routes/users");

const Ajv = require("ajv");
const ajv = new Ajv();

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
    }
};

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

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            message: "Kein Token vorhanden",
            messageId: 1,
            data: null
        });
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                message: "Token ungültig",
                messageId: 1,
                data: null
            });
        }
        req.user = user;
        next();
    });
}

function getValidationErrors(errors) {
    return errors.map(err => {
        let grund = "";

        switch (err.keyword) {
            case "type":
                grund = `Feld "${err.instancePath.slice(1)}" muss vom Typ "${err.params.type}" sein.`;
                break;
            case "required":
                grund = `Feld "${err.params.missingProperty}" ist erforderlich und fehlt.`;
                break;
            case "format":
                grund = `Feld "${err.instancePath.slice(1)}" hat nicht das korrekte Format (${err.params.format}).`;
                break;
            default:
                grund = `Fehler bei Feld "${err.instancePath.slice(1)}": ${err.message}`;
        }

        return {
            feld: err.instancePath.slice(1) || err.params?.missingProperty,
            fehler: err.message,
            grund: grund
        };
    });
}

// ALLE PERSONEN
app.get("/person", authenticateToken, (req, res) => {
    db.query("SELECT * FROM person", (err, results) => {
        if (err) return res.status(500).json({
            message: "Fehler beim Abrufen der Personen",
            messageId: 1,
            data: null
        });
        res.status(200).json({
            message: "Personen erfolgreich geladen",
            messageId: 0,
            data: results
        });
    });
});

// EINE PERSON
app.get("/person/:id", authenticateToken, (req, res) => {
    const { id } = req.params;
    db.query("SELECT * FROM person WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json({
            message: "Fehler beim Abrufen der Person",
            messageId: 1,
            data: null
        });
        if (result.length === 0) return res.status(404).json({
            message: "Person nicht gefunden",
            messageId: 1,
            data: { id }
        });
        res.status(200).json({
            message: "Person erfolgreich geladen",
            messageId: 0,
            data: result[0]
        });
    });
});

// PERSON HINZUFÜGEN
app.post("/person", authenticateToken, (req, res) => {
    const isValid = validatePerson(req.body);
    if (!isValid) {
        return res.status(400).json({
            message: "Ungültige Daten",
            messageId: 1,
            data: getValidationErrors(validatePerson.errors)
        });
    }

    const { vorname, nachname, plz, strasse, ort, telefonnummer, email } = req.body;
    const sql = `
        INSERT INTO person (vorname, nachname, plz, strasse, ort, telefonnummer, email)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [vorname, nachname, plz, strasse, ort, telefonnummer, email];

    db.query(sql, values, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Fehler beim Speichern der Person",
                messageId: 1,
                data: null
            });
        }

        db.query("SELECT * FROM person WHERE id = ?", [result.insertId], (err2, newPerson) => {
            if (err2) return res.status(500).json({
                message: "Fehler beim Abrufen der neuen Person",
                messageId: 1,
                data: null
            });
            res.status(201).json({
                message: "Person erfolgreich erstellt",
                messageId: 0,
                data: newPerson[0]
            });
        });
    });
});

// PERSON BEARBEITEN
app.put("/person/:id", authenticateToken, (req, res) => {
    const { id } = req.params;
    const isValid = validatePerson(req.body);
    if (!isValid) {
        return res.status(400).json({
            message: "Ungültige Daten",
            messageId: 1,
            data: getValidationErrors(validatePerson.errors)
        });
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
            return res.status(400).json({
                message: "Fehler beim Aktualisieren der Person",
                messageId: 1,
                data: null
            });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Person nicht gefunden",
                messageId: 1,
                data: { id }
            });
        }

        db.query("SELECT * FROM person WHERE id = ?", [id], (err2, updatedPerson) => {
            if (err2) return res.status(500).json({
                message: "Fehler beim Abrufen der aktualisierten Person",
                messageId: 1,
                data: null
            });
            res.status(200).json({
                message: "Person erfolgreich aktualisiert",
                messageId: 0,
                data: updatedPerson[0]
            });
        });
    });
});

// PERSON LÖSCHEN
app.delete("/person/:id", authenticateToken, (req, res) => {
    const { id } = req.params;

    db.query("SELECT * FROM person WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json({
            message: "Fehler beim Abrufen der Person",
            messageId: 1,
            data: null
        });
        if (result.length === 0) return res.status(404).json({
            message: "Person nicht gefunden",
            messageId: 1,
            data: { id }
        });

        const personToDelete = result[0];

        db.query("DELETE FROM person WHERE id = ?", [id], (err2) => {
            if (err2) return res.status(500).json({
                message: "Fehler beim Löschen der Person",
                messageId: 1,
                data: null
            });
            res.status(200).json({
                message: "Person erfolgreich gelöscht",
                messageId: 0,
                data: personToDelete
            });
        });
    });
});

app.listen(port, () => {
    console.log(`Server läuft unter http://localhost:${port}`);
});
