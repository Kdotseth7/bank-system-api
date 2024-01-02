const handleCreateAccount = (req, res, db) => {
    const { account_id, timestamp } = req.query;

    // Create account if it does not exist with a balance of 0.
    db('accounts')
    .select('*')
    .where('account_id', '=', account_id)
    .then(data => {
        if (data.length === 0) {
            db('accounts')
            .insert({
                account_id: account_id,
                timestamp: timestamp,
                balance: 0,
                transaction_totals: 0
            })
            .returning('*')
            .then(data => res.status(201).send(data))
        } else {
            res.json("Account already exists.")
        }
    }).catch(err => res.status(400).json('Account creation failed.'));
}

module.exports = {
    handleCreateAccount: handleCreateAccount
}