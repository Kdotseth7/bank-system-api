const express = require('express');
const app = express();
const cors = require('cors');
const knex = require('knex');
const bodyParser = require('body-parser');
const create_account = require('./controllers/create_account');
require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());

const db = knex({
    client: 'pg', 
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    }
});

db.raw('SELECT * FROM accounts').then(data => {
    console.log(data.rows);
});

// Root
app.get('/', (req, res) => {
    res.send('Hello, Welcome to Bank System Backend!');
});

// Create Account - POST
app.post('/create_account', (req, res) => create_account.handleCreateAccount(req, res, db));

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
