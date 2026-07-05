const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const apiRouter = require('./routes/api.cjs');

const app = express();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use(express.json());
app.use(cors());

app.use('/api', apiRouter);
app.use(express.static(path.join(__dirname, '..', 'dist')));

app.get('*joku', (req, res) => {
  res.status(404).json({ message: 'Ei pyydettyä palvelua' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

module.exports = app;
