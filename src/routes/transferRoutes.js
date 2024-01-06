const express = require('express');
const router = express.Router();

// Import controllers
const transfer = require('../controllers/transfers/transfer');
const accept_transfer = require('../controllers/transfers/accept_transfer');

// TRANSFER - POST
router.post('/transfer', (req, res) => transfer.handleTransfer(req, res));

// ACCEPT TRANSFER - POST
router.post('/accept_transfer', (req, res) => accept_transfer.handleAcceptTransfer(req, res));


module.exports = router;