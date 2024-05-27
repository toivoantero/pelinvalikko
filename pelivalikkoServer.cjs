const express = require('express');
const http = require('http');
const sqlite3 = require('sqlite3');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;
const cors = require('cors');
const saltRounds = 10;
const jwtSecret = 'your_jwt_secret';
let helmet = require('helmet');

app.use(helmet({ crossOriginResourcePolicy: false }))
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use(express.json());
app.use(cors());

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

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, jwtSecret, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

// Määrittele API-reititykset
app.get('/api/hahmo/all', authenticateJWT, (req, res) => {
    const userId = req.user.id;
    db.all('SELECT * FROM hahmo WHERE user_id = ?', [userId], (error, result) => {
        if (error) {
            console.log(error.message);
            return res.status(400).json({ message: error.message });
        }
        return res.status(200).json(result);
    });
});

app.get('/api/kayttaja/all', authenticateJWT, (req, res) => {
    const userId = req.user.id;
    db.all('SELECT * FROM users WHERE id = ?', [userId], (error, result) => {
        if (error) {
            console.log(error.message);
            return res.status(400).json({ message: error.message });
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
app.post('/api/hahmo/add', authenticateJWT, upload.single('kuva'), (req, res) => {
    const hahmo = req.body;
    const userId = req.user.id;

    db.run(
        'INSERT INTO hahmo (nimi, ammatti, ika, kokemuspisteet, ase, kuva, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [hahmo.nimi, hahmo.ammatti, hahmo.ika, hahmo.kokemuspisteet, hahmo.ase, hahmo.kuva, userId],
        (error) => {
            if (error) {
                console.log(error.message);
                return res.status(400).json({ message: error.message });
            }
            return res.status(200).json({ count: 1 });
        }
    );
});

app.get('/api/lataa/:nimi', (req, res) => {
    let file = './kuvat/' + req.params.nimi;
    res.download(file);
});

app.get('*', (req, res) => {
    return res.status(404).json({ message: 'Ei pyydettyä palvelua' });
});

// Käsittely virheille
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

// Rekisteröinti
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    if (username.length < 4 || password.length < 4) {
        return res.status(400).json({ error: 'Username and password must be at least 4 characters long' });
    }
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], function(err) {
        if (err) {
            return res.status(400).json({ error: 'Username already exists' });
        }
        res.status(201).json({ message: 'User created' });
    });
});

// Kirjautuminen
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
        if (err || !user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        console.log(`Is password valid: ${isPasswordValid}`);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '1h' });
        res.json({ token });
    });
});
