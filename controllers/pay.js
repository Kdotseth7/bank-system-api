const handlePay = (req, res, db) => {
    const { account_id, timestamp, amount } = req.query;

    // Withdraw money from the given account if it exists and has sufficient funds.
    db('accounts')
    .select('*')
    .where('account_id', '=', account_id)
    .then(data => {
        if (data.length === 0) {
            res.send("Account does not exist.")
        } else if (data[0].balance > parseInt(amount)) {
            db('accounts')
            .where('account_id', '=', account_id)
            .update({balance: data[0].balance - parseInt(amount)})
            .returning('*')
            .then(data => res.status(201).send(data))
        } else {
            res.json('Insufficient funds.')
        }
    }).catch(err => res.status(400).json('Payment failed.'));
}

module.exports = {
    handlePay: handlePay
}