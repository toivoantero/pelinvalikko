const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [respF, respM] = await Promise.all([
      axios.get('https://fantasyname.lukewh.com/?gender=f'),
      axios.get('https://fantasyname.lukewh.com/?gender=m'),
    ]);

    const parse = (data) => {
      if (Array.isArray(data) && data.length > 0) return data[0];
      if (typeof data === 'object' && data.name) return data.name;
      if (typeof data === 'string') return data;
      return '';
    };

    res.status(200).json({
      nainen: parse(respF.data) || 'Megara',
      mies: parse(respM.data) || 'Balthasar',
    });
  } catch (error) {
    console.error('Nimet API error:', error.message);
    res.status(200).json({ nainen: 'Megara', mies: 'Balthasar' });
  }
});

module.exports = router;
