const express = require('express');
const app = express();

let helmet = require('helmet');
app.use(helmet({ crossOriginResourcePolicy: false }))

app.use(express.urlencoded({ limit: '5mb', extended: true }));

const cors = require('cors');
app.use(cors());

app.use(express.json());   

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('pelivalikko.db', (error) => {
    if (error) {
        console.log(error.message);
        return res.status(400).json({ message: 'Kantaa ei voida avata' });
    }
});

app.listen(8080, () => {
    console.log('Node toimii localhost:8080');
});

app.get('/', (req, res) => {
    return res.status(200).json({ message: 'Toimii' });
});

app.get('/hahmo/all', (req, res) => {
    db.all('select * from hahmo', (error, result) => {
        if (error) {
            console.log(error.message);
            return res.status(400).json({ message: error.message });
        }

        return res.status(200).json(result);
    });
});

app.get('/omatvarusteet/all', (req, res) => {
    db.all('select * from omatvarusteet', (error, result) => {
        if (error) {
            console.log(error.message);
            return res.status(400).json({ message: error.message });
        }

        return res.status(200).json(result);
    });
});

app.get('/kaupanvarusteet/all', (req, res) => {
    db.all('select * from kaupanvarusteet', (error, result) => {
        if (error) {
            console.log(error.message);
            return res.status(400).json({ message: error.message });
        }

        return res.status(200).json(result);
    });
});

app.get('/hahmo/one/:id', (req, res) => {
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

app.get('/hahmo/kuvat', (req, res) => {
    db.all('select kuva from hahmo where kuva IS NOT NULL', (error, result) => {
        if (error) {
            console.log(error.message);
            return res.status(400).json({ message: error.message });
        }

        return res.status(200).json(result);
    });
});

app.delete('/hahmo/delete/:id', (req, res) => {
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
app.post('/hahmo/add', upload.single('kuva'), (req, res) => {
    let hahmo = req.body;

    let kuvaNimi = null;
    if (req.file) {
        kuvaNimi = req.file.originalname;
    }

    db.run('insert into hahmo (nimi,ammatti,ika,kokemuspisteet,ase,kuva) values (?, ?, ?, ?, ?, ?)',
        [hahmo.nimi, hahmo.ammatti, hahmo.ika, hahmo.kokemuspisteet, hahmo.ase, kuvaNimi], (error) => {

            if (error) {
                console.log(error.message);
                return res.status(400).json({ message: error.message });
            }

            return res.status(200).json({ count: 1 });
        });
});
*/
app.post('/hahmo/add', upload.single('kuva'), (req, res) => {
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

app.get('/lataa/:nimi', (req, res) => {
    let file = './kuvat/' + req.params.nimi;
    res.download(file);
});

app.get('*', (req, res) => {
    return res.status(404).json({ message: 'Ei pyydettyä palvelua' });
});
