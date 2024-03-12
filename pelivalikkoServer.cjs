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

app.get('/api/omatvarusteet/all', (req, res) => {
    db.all('select * from omatvarusteet', (error, result) => {
        if (error) {
            console.log(error.message);
            return res.status(400).json({ message: error.message });
        }

        return res.status(200).json(result);
    });
});

app.get('/api/kaupanvarusteet/all', (req, res) => {
    db.all('select * from kaupanvarusteet', (error, result) => {
        if (error) {
            console.log(error.message);
            return res.status(400).json({ message: error.message });
        }

        return res.status(200).json(result);
    });
});

app.get('/api/hahmo/one/:id', (req, res) => {
    let id = req.params.id;

    db.get('select * from hahmo where id = ?', [id], (error, result) => {
        if (error) {
            console.log(error.message);
            return res.status(400).json({ message: error.message });
        }

        // Jos haku ei tuottanut yhtään riviä
        if (typeof (result) == 'undefined') {
            return res.status(404).json({ message: 'Haettua hahmoa ei ole' });
        }

        return res.status(200).json(result);
    });
});

app.get('/api/hahmo/kuvat', (req, res) => {
    db.all('select kuva from hahmo where kuva IS NOT NULL', (error, result) => {
        if (error) {
            console.log(error.message);
            return res.status(400).json({ message: error.message });
        }

        return res.status(200).json(result);
    });
});

app.delete('/api/hahmo/delete/:id', (req, res) => {
    let id = req.params.id;

    // Huomaa, että ei nuolinotaatiofunktioina kuten muissa kohdissa
    db.run('delete from hahmo where id = ?', [id], function (error) {
        if (error) {
            console.log(error.message);
            return res.status(400).json({ message: error.message });
        }

        if (this.changes === 0) {
            console.log('Ei poistettavaa');
            return res.status(404).json({ message: 'Ei poistettavaa hahmoa' });
        }

        return res.status(200).json({ count: this.changes });
    });
});

const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './kuvat'); // Mihin kansioon ladataan
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);  // Millä tiedostonimellä
    }
});

const upload = multer({ storage: storage })
/*
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
*/
app.post('/api/hahmo/add', upload.single('kuva'), (req, res) => {
    let hahmo = req.body;

    db.run('insert into hahmo (nimi,ammatti,ika,kokemuspisteet,ase,kuva) values (?, ?, ?, ?, ?, ?)',
        [hahmo.nimi, hahmo.ammatti, hahmo.ika, hahmo.kokemuspisteet, hahmo.ase, hahmo.kuva], (error) => {

            if (error) {
                console.log(error.message);
                return res.status(400).json({ message: error.message });
            }

            return res.status(200).json({ count: 1 });
        });
});

app.get('/api/lataa/:nimi', (req, res) => {
    let file = './kuvat/' + req.params.nimi;
    res.download(file);
});

// Käsittely virheille
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});
