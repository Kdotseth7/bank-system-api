// Import packages and modules
const express = require('express');
const app = express();
const cors = require('cors');
const knex = require('knex');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import controllers
const create_account = require('./controllers/create_account');
const pay = require('./controllers/pay');
const deposit = require('./controllers/deposit');
const top_activity = require('./controllers/top_activity');
const transfer = require('./controllers/transfer');
const accept_transfer = require('./controllers/accept_transfer');
const get_account_details = require('./controllers/get_account_details');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// DB connection
const db = knex({
    client: 'pg', 
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME, 
        port: process.env.DB_PORT,
        ssl: { rejectUnauthorized: false }
    }
});

// // Test DB connection
// db.raw('SELECT * FROM accounts').then(data => {
//     console.log(data.rows);
// });

// ROOT - GET
app.get('/', (req, res) => {
    res.send('Hello, Welcome to Bank System Backend!');
});

// CREATE ACCOUNT - POST
app.post('/create_account', (req, res) => create_account.handleCreateAccount(req, res, db));

// PAY - POST
app.post('/pay', (req, res) => pay.handlePay(req, res, db));

// DEPOSIT - POST
app.post('/deposit', (req, res) => deposit.handleDeposit(req, res, db));

// TOP ACTIVITY - GET
app.get('/top_activity', (req, res) => top_activity.handleTopActivity(req, res, db));

// TRANSFER - POST
app.post('/transfer', (req, res) => transfer.handleTransfer(req, res, db));

// ACCEPT TRANSFER - POST
app.post('/accept_transfer', (req, res) => accept_transfer.handleAcceptTransfer(req, res, db));

// GET ACCOUNT DETAILS - GET
app.get('/get_account_details', (req, res) => get_account_details.handleGetAccountDetails(req, res, db));

// Listen on port
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
