const express = require('express');
const path = require('path');

const router = express.Router();

router.get('/:nimi', (req, res) => {
  const fileName = req.params.nimi;
  const filePath = path.resolve(__dirname, '../../kuvat', fileName);
  res.download(filePath);
});

module.exports = router;
