const handleDeposit = (req, res, db) => {
    const { account_id, timestamp, amount } = req.query;

    // Deposit money into the given account if it exists.
    db('accounts')
    .select('*')
    .where('account_id', '=', account_id)
    .then(data => {
        if (data.length === 0) {
            res.send("Account does not exist.")
        } else {
            db('accounts')
            .where('account_id', '=', account_id)
            .update({balance: data[0].balance + parseInt(amount)})
            .returning('*')
            .then(data => res.status(201).send(data))
            .catch(err => res.status(400).json('Deposit failed.'))
        }
    })
    .catch(err => res.status(400).json('Deposit failed.'));

}

module.exports = {
    handleDeposit: handleDeposit
}