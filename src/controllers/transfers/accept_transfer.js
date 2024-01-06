const db = require('../../../config/db');

const handleAcceptTransfer = (req, res) => {
    const { account_id, transfer_id } = req.query;
    let transferAmount = null;
    let sourceAccountId = null;

    db.transaction(trx => {
        trx('transfers')
        .select('*')
        .where('transfer_id', '=', transfer_id)
        .then(existingTransfer => {
            if (!existingTransfer.length) {
                throw new Error("Transfer does not exist.");
            } else if (existingTransfer[0].target_id !== account_id) {
                throw new Error("Transfer does not belong to this account.");
            } else {
                sourceAccountId = existingTransfer[0].source_id;
                transferAmount = existingTransfer[0].amount;
                return trx('transfers')
                .delete()
                .where('transfer_id', '=', transfer_id);
            }
        })
        .then(data => {
            if (data) {
                return trx('query')
                .select(trx.raw('MAX(timestamp) as max_timestamp'))
                .where('account_id', '=', account_id)
                .returning('max_timestamp');
            }
        })
        .then(max_timestamp => {
            if (max_timestamp) {
                return trx('query')
                .insert({
                    account_id: account_id,
                    timestamp: max_timestamp[0].max_timestamp + 1,
                    command: 'ACCEPT_TRANSFER'
                })
                .returning('account_id');
            }
        })
        .then(acc_id => {
            if (acc_id) {
                return trx('accounts')
                .where('account_id', '=', acc_id[0].account_id)
                .increment('balance', transferAmount)
                .increment('transaction_totals', transferAmount)
                .returning('*');
            }
        })
        .then(data => {
            if (data) {
                return trx('accounts')
                .where('account_id', '=', sourceAccountId)
                .increment('transaction_totals', transferAmount)
                .returning('*');
            }
        })
        .then(data => {
            if (data) {
                trx.commit();
                res.status(201).json("Transfer accepted.");
            }
        })
        .catch(err => {
            trx.rollback();
            if (err.message === "Transfer does not exist.") {
                res.status(400).json(err.message);
            } else if (err.message === "Transfer does not belong to this account.") {
                res.status(400).json(err.message);
            } else {
                res.status(400).json('Transfer acceptance failed.');
            }
        })
    })
}

module.exports = {
    handleAcceptTransfer: handleAcceptTransfer
}