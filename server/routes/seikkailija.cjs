const express = require('express');
const multer = require('multer');
const db = require('../db.cjs');
const { authenticateJWT } = require('../auth.cjs');

const router = express.Router();
router.use(authenticateJWT);

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './kuvat');
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage });

router.get('/all', (req, res) => {
  const userId = req.user.id;

  db.all('SELECT * FROM seikkailija WHERE pel_id = ?', [userId], (error, result) => {
    if (error) {
      console.error(error.message);
      return res.status(400).json({ message: error.message });
    }

    res.status(200).json(result);
  });
});

router.get('/one/:id', (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  db.get('SELECT * FROM seikkailija WHERE id = ? AND pel_id = ?', [id, userId], (error, result) => {
    if (error) {
      console.error(error.message);
      return res.status(400).json({ message: error.message });
    }

    if (!result) {
      return res.status(404).json({ message: 'Haettua seikkailijaa ei ole' });
    }

    res.status(200).json(result);
  });
});

router.get('/kuvat', (req, res) => {
  const userId = req.user.id;

  db.all('SELECT kuva FROM seikkailija WHERE pel_id = ? AND kuva IS NOT NULL', [userId], (error, result) => {
    if (error) {
      console.error(error.message);
      return res.status(400).json({ message: error.message });
    }

    res.status(200).json(result);
  });
});

router.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  db.run('DELETE FROM seikkailija WHERE id = ? AND pel_id = ?', [id, userId], function (error) {
    if (error) {
      console.error(error.message);
      return res.status(400).json({ message: error.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: 'Ei poistettavaa seikkailijaa' });
    }

    res.status(200).json({ count: this.changes });
  });
});

router.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { nimi, ammatti, kokemuspisteet, ika, ase, kuva } = req.body;
  const userId = req.user.id;

  if (!nimi || !ammatti || !kokemuspisteet || !ika) {
    return res.status(400).json({ message: 'Kaikki kentät ovat pakollisia!' });
  }

  const sql = `UPDATE seikkailija
               SET nimi = ?, ammatti = ?, kokemuspisteet = ?, ika = ?, ase = ?, kuva = ?
               WHERE id = ? AND pel_id = ?`;
  const params = [nimi, ammatti, kokemuspisteet, ika, ase, kuva, id, userId];

  db.run(sql, params, function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: 'Tietokantavirhe.' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: 'Seikkailijaa ei löytynyt.' });
    }

    res.json({ message: 'Seikkailija päivitetty onnistuneesti!' });
  });
});

router.post('/add', authenticateJWT, upload.single('kuva'), (req, res) => {
  const seikkailija = req.body;
  const userId = req.user.id;

  db.run(
    'INSERT INTO seikkailija (pel_id, nimi, ammatti, ika, kokemuspisteet, ase, kuva) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [
      userId,
      seikkailija.nimi,
      seikkailija.ammatti,
      seikkailija.ika,
      seikkailija.kokemuspisteet,
      seikkailija.ase,
      seikkailija.kuva,
    ],
    (error) => {
      if (error) {
        console.error(error.message);
        return res.status(400).json({ message: error.message });
      }

      res.status(200).json({ count: 1 });
    }
  );
});

module.exports = router;
