// Import packages and modules
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config(
    { path: process.env.NODE_ENV === 'prod' ? '.env.prod' : '.env.dev' }
);
  
// Middleware
app.use(cors());
app.use(bodyParser.json());

// Import routes
const accountRoutes = require('./src/routes/accountRoutes');
const transferRoutes = require('./src/routes/transferRoutes');
app.use('/accounts', accountRoutes);
app.use('/transfers', transferRoutes);

// ROOT - GET
app.get('/', (req, res) => {
    res.send('<h1>Hello, Welcome to Bank System Backend!</h1>');
});

// Listen on port
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on PORT:${PORT}`);
});

module.exports = app;