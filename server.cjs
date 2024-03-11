const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.static('dist')); // Olettaen, että index.html on dist-kansiossa

// Pääsivun reititys
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
