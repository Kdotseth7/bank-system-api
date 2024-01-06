const db = require('../../../config/db');

const handleCreateAccount = (req, res) => {
    const { account_id } = req.query;

    // Create account if it does not exist with a balance of 0.
    db.transaction(trx => {
        trx('accounts')
        .select('*')
        .where('account_id', '=', account_id)
        .then(existingAccount => {
            if (!existingAccount.length) {
                return trx('query')
                .insert({
                    account_id: account_id,
                    timestamp: 1,
                    command: 'CREATE_ACCOUNT'
                })
                .returning('account_id')
            } else {
                throw new Error("Account already exists.");
            }
        })
        .then(acc_id => {
            if (acc_id) {
                return trx('accounts')
                .insert({
                    account_id: acc_id[0].account_id,
                    balance: 0,
                    transaction_totals: 0
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
            if (err.message === "Account already exists.") {
                res.status(400).json(err.message);
            } else {
                res.status(400).json('Account creation failed.');
            }
        })
    })
    .catch(err => res.status(400).json('Transaction failed.'));
}

module.exports = {
    handleCreateAccount: handleCreateAccount
}