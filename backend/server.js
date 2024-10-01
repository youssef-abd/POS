const express = require('express');
const app = express();
const PORT = process.env.PORT || 4001;

// Import MySQL connection
const { connection } = require('./db');

// Set CORS headers globally
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
  next();
});
// Middleware pour traiter les requêtes JSON
app.use(express.json());
// Example route to fetch data from MySQL
app.get('/api/data', (req, res) => {
  connection.query('SELECT * FROM transactions', (err, results) => {
    if (err) {
      console.error('Error executing MySQL query: ', err);
      res.status(500).json({ error: 'Failed to fetch data' });
      return;
    }
    res.json(results);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});