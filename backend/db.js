const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 4000;

// Configurer MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'base'
});

// Connecter à MySQL
db.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à MySQL : ', err);
        throw err; // Arrête l'exécution si la connexion échoue
    }
    console.log('Connecté à la base de données MySQL.');
});

// Middleware to enable CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
    next();
});

// Middleware pour parser les requêtes JSON
app.use(bodyParser.json());

// Endpoint to fetch data
app.get('/api/data', (req, res) => {
    const sql = 'SELECT * FROM transactions';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(results);
    });
});

// Endpoint to handle checkout
app.post('/api/checkout', (req, res) => {
    const { paymentMethod, total, cart, auth_code } = req.body;

    const dateTime = new Date().toISOString(); // Date et heure actuelle au format ISO

    const sqlInsertTransaction = 'INSERT INTO transactions (date_time, total_amount, payment_method,auth_code) VALUES (?, ?, ?, ?)'; //add auth_code
    db.query(sqlInsertTransaction, [dateTime, total, paymentMethod, auth_code], (err, result) => {
        if (err) {
            console.error('Error inserting transaction:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        const transactionId = result.insertId;

        const sqlInsertDetails = 'INSERT INTO details (transaction_id, ticket_id, ticket_name, quantity) VALUES ?';
        const values = cart.map(item => [transactionId, item.id, item.name, item.quantity]);

        db.query(sqlInsertDetails, [values], (err, result) => {
            if (err) {
                console.error('Error inserting transaction details:', err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
            res.status(200).json({ message: 'Transaction successful' });
        });
    });
});



// Nouvel endpoint pour récupérer les tickets
app.get('/api/tickets', (req, res) => {
    const sql = 'SELECT * FROM tickets';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des tickets :', err);
            res.status(500).send('Erreur interne du serveur');
            return;
        }
        res.json(results);
    });
});

// Endpoint pour vérifier le code d'authentification
app.post('/api/login', (req, res) => {
    const { auth_code } = req.body;
    if (!auth_code) {
        return res.status(400).json({ error: 'Code d\'authentification requis' });
    }

    const query = 'SELECT * FROM users WHERE auth_code = ?';
    db.query(query, [auth_code], (err, results) => {
        if (err) {
            console.error('Erreur lors de la vérification du code d\'authentification :', err);
            return res.status(500).json({ error: 'Erreur interne du serveur' });
        }
        if (results.length > 0) {
            return res.status(200).json({ message: 'Authentification réussie' });
        } else {
            return res.status(401).json({ error: 'Code d\'authentification invalide' });
        }
    });
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
