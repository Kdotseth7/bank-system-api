const db = require('../../../config/db');

const handleDeposit = (req, res) => {
    const { account_id, amount } = req.query;
    let currentBalance = null;
    let currentTransactionTotals = null;

    // Deposit money into the given account if it exists.
    db.transaction(trx => {
        trx('accounts')
        .select('*')
        .where('account_id', '=', account_id)
        .then(existingAccount => {
            if (existingAccount.length === 1) {
                currentBalance = existingAccount[0].balance; // Retrieve the current balance
                currentTransactionTotals = existingAccount[0].transaction_totals; // Retrieve the current transaction totals
                return trx('query')
                .select(trx.raw('MAX(timestamp) as max_timestamp'))
                .where('account_id', '=', account_id)
                .returning('max_timestamp')
            } else {
                throw new Error("Account does not exist.");
            }
        })
        .then(max_timestamp => {
            if (max_timestamp) {
                return trx('query')
                .insert({
                    account_id: account_id,
                    timestamp: max_timestamp[0].max_timestamp + 1,
                    command: 'DEPOSIT'
                })
                .returning('account_id')
            }
        })
        .then(acc_id => {
            if (acc_id) {
                return trx('accounts')
                .where('account_id', '=', acc_id[0].account_id)
                .update({
                        balance: currentBalance + parseInt(amount), 
                        transaction_totals: currentTransactionTotals + parseInt(amount)
                    })
                .returning('*')
            }
        })
        .then(data => {
            if (data) {
                trx.commit();
                res.status(201).json(data);
            }
        })
        .catch(err => {
            trx.rollback();
            if (err.message === "Account does not exist.") {
                res.status(400).json(err.message);
            } else {
                res.status(400).json('Deposit failed.');
            }
        })
    })
    .catch(err => res.status(400).json('Transaction failed.'));
}

module.exports = {
    handleDeposit: handleDeposit
}