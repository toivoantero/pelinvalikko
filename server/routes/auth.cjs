const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db.cjs');
const { jwtSecret } = require('../auth.cjs');

const router = express.Router();
const saltRounds = 10;

router.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || username.length < 4 || !password || password.length < 4) {
    return res.status(400).json({ error: 'Username and password must be at least 4 characters long' });
  }

  const hashedPassword = bcrypt.hashSync(password, saltRounds);

  db.run('INSERT INTO pelaajatili (username, password) VALUES (?, ?)', [username, hashedPassword], function (err) {
    if (err) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const playerId = this.lastID;
    const defaultVarusteet = [
      { pel_id: playerId, sei_id: 1, nimi: 'Hopeatikari', vahinko: 13, paino: 1, hinta: 95, tyyppi: 'Yhden käden', omistaja: 'pelaaja' },
      { pel_id: playerId, sei_id: 1, nimi: 'Gladius', vahinko: 33, paino: 9, hinta: 129, tyyppi: 'Yhden käden', omistaja: 'pelaaja' },
      { pel_id: playerId, sei_id: 1, nimi: 'Vastakaarijousi', vahinko: 21, paino: 2, hinta: 87, tyyppi: 'Kahden käden', omistaja: 'pelaaja' },
      { pel_id: playerId, sei_id: 1, nimi: 'Paimensauva', vahinko: 11, paino: 3, hinta: 15, tyyppi: 'Kahden käden', omistaja: 'pelaaja' },
      { pel_id: playerId, sei_id: 1, nimi: 'Claymore', vahinko: 51, paino: 15, hinta: 160, tyyppi: 'Kahden käden', omistaja: 'pelaaja' },
      { pel_id: playerId, sei_id: 1, nimi: 'Rapiiri', vahinko: 20, paino: 2, hinta: 100, tyyppi: 'Yhden käden', omistaja: 'pelaaja' },
      { pel_id: playerId, sei_id: 1, nimi: 'Kivi', vahinko: 5, paino: 2, hinta: 1, tyyppi: 'Yhden käden', omistaja: 'pelaaja' },
      { pel_id: playerId, sei_id: 1, nimi: 'Hilpari', vahinko: 42, paino: 10, hinta: 90, tyyppi: 'Kahden käden', omistaja: 'pelaaja' },
      { pel_id: playerId, sei_id: 1, nimi: 'Savupommi', vahinko: 10, paino: 3, hinta: 90, tyyppi: 'Yhden käden', omistaja: 'kauppa' },
      { pel_id: playerId, sei_id: 1, nimi: 'Pronssimiekka', vahinko: 30, paino: 9, hinta: 80, tyyppi: 'Yhden käden', omistaja: 'kauppa' },
      { pel_id: playerId, sei_id: 1, nimi: 'Paimenen linko', vahinko: 7, paino: 1, hinta: 5, tyyppi: 'Kahden käden', omistaja: 'kauppa' },
      { pel_id: playerId, sei_id: 1, nimi: 'Pronssitikari', vahinko: 11, paino: 1, hinta: 45, tyyppi: 'Yhden käden', omistaja: 'kauppa' },
    ];

    const insertVaruste = db.prepare('INSERT INTO varusteet (pel_id, sei_id, nimi, vahinko, paino, hinta, tyyppi, omistaja) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    for (const varuste of defaultVarusteet) {
      insertVaruste.run([
        varuste.pel_id,
        varuste.sei_id,
        varuste.nimi,
        varuste.vahinko,
        varuste.paino,
        varuste.hinta,
        varuste.tyyppi,
        varuste.omistaja,
      ]);
    }
    insertVaruste.finalize();

    res.status(201).json({ message: 'User created and default items added' });
  });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM pelaajatili WHERE username = ?', [username], (err, user) => {
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

module.exports = router;
