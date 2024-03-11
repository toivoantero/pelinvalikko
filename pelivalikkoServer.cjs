const express = require('express');
const http = require('http');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;

app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use(express.json());

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('pelivalikko.db', (error) => {
    if (error) {
        console.log(error.message);
        // Palauta virhe jos tietokantaa ei voida avata
        throw error;
    }
});

// Luo HTTP-palvelin
const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Staattisten tiedostojen palveleminen (esim. index.html, index.js, jne.)
app.use(express.static(path.join(__dirname, 'dist')));

// Määrittele API-reititykset
app.get('/api/hahmo/all', (req, res) => {
    // Palauta kaikki hahmot tietokannasta
    db.all('SELECT * FROM hahmo', (error, result) => {
        if (error) {
            console.log(error.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.status(200).json(result);
    });
});

app.post('/api/hahmo/add', (req, res) => {
    // Lisää uusi hahmo tietokantaan
    const { nimi, ammatti, ika, kokemuspisteet, ase } = req.body;
    db.run('INSERT INTO hahmo (nimi, ammatti, ika, kokemuspisteet, ase) VALUES (?, ?, ?, ?, ?)',
        [nimi, ammatti, ika, kokemuspisteet, ase],
        (error) => {
            if (error) {
                console.log(error.message);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            return res.status(201).json({ message: 'Hahmo lisätty onnistuneesti' });
        }
    );
});

// Muut reititykset tarpeesi mukaan...

// Käsittely virheille
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});
