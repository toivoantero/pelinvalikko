const express = require('express');
const db = require('../db.cjs');
const { authenticateJWT } = require('../auth.cjs');

const router = express.Router();
router.use(authenticateJWT);

router.get('/all', (req, res) => {
  const userId = req.user.id;

  db.all('SELECT * FROM pelaajatili WHERE id = ?', [userId], (error, result) => {
    if (error) {
      console.error(error.message);
      return res.status(400).json({ message: error.message });
    }

    res.status(200).json(result);
  });
});

module.exports = router;
