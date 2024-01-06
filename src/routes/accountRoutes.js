const express = require('express');
const router = express.Router();

// Import controllers
const create_account = require('../controllers/accounts/create_account');
const get_account_details = require('../controllers/accounts/get_account_details');
const pay = require('../controllers/accounts/pay');
const deposit = require('../controllers/accounts/deposit');
const top_activity = require('../controllers/accounts/top_activity');

// CREATE ACCOUNT - POST
router.post('/create_account', (req, res) => create_account.handleCreateAccount(req, res));

// GET ACCOUNT DETAILS - GET
router.get('/get_account_details', (req, res) => get_account_details.handleGetAccountDetails(req, res));

// PAY - POST
router.post('/pay', (req, res) => pay.handlePay(req, res));

// DEPOSIT - POST
router.post('/deposit', (req, res) => deposit.handleDeposit(req, res));

// TOP ACTIVITY - GET
router.get('/top_activity', (req, res) => top_activity.handleTopActivity(req, res));

module.exports = router;