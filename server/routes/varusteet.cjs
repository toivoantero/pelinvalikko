const express = require('express');
const db = require('../db.cjs');
const { authenticateJWT } = require('../auth.cjs');

const router = express.Router();
router.use(authenticateJWT);

router.get('/all', (req, res) => {
  const userId = req.user.id;

  db.all('SELECT * FROM varusteet WHERE pel_id = ?', [userId], (error, result) => {
    if (error) {
      console.error(error.message);
      return res.status(400).json({ message: error.message });
    }

    res.status(200).json(result);
  });
});

router.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { nimi, vahinko, paino, hinta, tyyppi, omistaja } = req.body;
  const userId = req.user.id;

  if (!nimi || !vahinko || !paino || !hinta || !tyyppi || !omistaja) {
    return res.status(400).json({ message: 'Kaikki kentät ovat pakollisia!' });
  }

  const sql = `UPDATE varusteet
               SET nimi = ?, vahinko = ?, paino = ?, hinta = ?, tyyppi = ?, omistaja = ?
               WHERE id = ? AND pel_id = ?`;
  const params = [nimi, vahinko, paino, hinta, tyyppi, omistaja, id, userId];

  db.run(sql, params, function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: 'Tietokantavirhe.' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: 'Varusteita ei löytynyt.' });
    }

    res.json({ message: 'Varusteet päivitetty onnistuneesti!' });
  });
});

module.exports = router;
