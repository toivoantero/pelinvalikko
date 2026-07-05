const sqlite3 = require('sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = process.env.DB_PATH || path.resolve(__dirname, '..', 'pelivalikko.db');
if (dbPath !== ':memory:') {
  console.log('Tietokantapolku:', dbPath);
  console.log('Tietokanta olemassa:', fs.existsSync(dbPath));
}

const db = new sqlite3.Database(dbPath, (error) => {
  if (error) {
    console.error('Tietokannan avaaminen epäonnistui:', error);
  } else if (dbPath !== ':memory:') {
    console.log('Yhdistetty tietokantaan');
  }
});

module.exports = db;
