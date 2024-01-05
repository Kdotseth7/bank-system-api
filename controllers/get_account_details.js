const handleGetAccountDetails = (req, res, db) => {
    const { account_id } = req.query;
    let response = {};

    db('accounts')
    .select('*')
    .where('account_id', '=', account_id)
    .then(data => {
        if (!data.length) {
            throw new Error("Account does not exist.");
        } else {
            response = data[0];
        }
    }).then(() => {
        db('query')
        .select('*')
        .where('account_id', '=', account_id)
        .orderBy('timestamp', 'asc')
        .then(data => {
            response['transaction_history'] = data;
            res.status(201).json(response);
        })
    })
    .catch(err => {
        if (err.message === "Account does not exist.") {
            res.status(400).json(err.message);
        } else {
            res.status(400).json('Failed to fetch account details.');
        }
    });
}

module.exports = {
    handleGetAccountDetails: handleGetAccountDetails
}