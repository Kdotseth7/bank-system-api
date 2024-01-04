const handleTransfer = (req, res, db) => {
    const { source_id, target_id, amount } = req.query;
    let sourceAccountBalance = null;
    let transferTimestamp = null;
    let transferId = null;

    if (source_id === target_id) {
        return res.status(400).json({error: "Source and target accounts must be different."});
    }

    db.transaction(trx => {
        trx('accounts')
        .select('*')
        .where('account_id', '=', source_id)
        .then(sourceAccount => {
            sourceAccountBalance = sourceAccount[0].balance;
            if (!sourceAccount.length) {
                throw new Error("Source account does not exist.");
            } else if (sourceAccountBalance < parseInt(amount)) {
                throw new Error("Insufficient funds in source account.");
            } else if (sourceAccount.length === 1) {
                return trx('accounts')
                .select('*')
                .where('account_id', '=', target_id);
            }
        })
        .then(targetAccount => {
            if (!targetAccount.length) {
                throw new Error("Target account does not exist.");
            } else if (targetAccount.length === 1){
                return trx('query')
                .select(trx.raw('MAX(timestamp) as max_timestamp'))
                .where('account_id', '=', source_id)
                .returning('max_timestamp');
            }
        })
        .then(max_timestamp => {
            if (max_timestamp) {
                transferTimestamp = max_timestamp[0].max_timestamp + 1;
                return trx('query')
                .insert({
                    account_id: source_id,
                    timestamp: transferTimestamp,
                    command: 'TRANSFER'
                })
                .returning('account_id');
            }
        })
        .then(acc_id => {
            if (acc_id) {
                return trx('accounts')
                .where('account_id', '=', acc_id[0].account_id)
                .update({
                    balance: sourceAccountBalance - parseInt(amount),
                })
                .returning('*');
            }
        })
        .then(transferData => {
            if (transferData) {
                return trx('transfers')
                .count('*')
                .where('source_id', '=', source_id)
                .returning('*');
            }
        })
        .then(data => {
            transferId = parseInt(data[0].count) + 1;
            if (data) {
                return trx('transfers').insert({
                    source_id: source_id,
                    target_id: target_id,
                    amount: parseInt(amount),
                    timestamp: transferTimestamp,
                    transfer_id: `transfer${transferId}`
                })
                .returning('*');
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
            if (err.message === "Source and target accounts must be different.") {
                res.status(400).json(err.message);
            } else if (err.message === "Source account does not exist.") {
                res.status(400).json(err.message);
            } else if (err.message === "Target account does not exist.") {
                res.status(400).json(err.message);
            } else if (err.message === "Insufficient funds in source account.") {
                res.status(400).json(err.message);
            } else {
                res.status(400).json('Transfer failed.');
            }
        });
    })
}

module.exports = {
    handleTransfer: handleTransfer
}