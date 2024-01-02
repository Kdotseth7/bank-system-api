const handleTopActivity = (req, res, db) => {
    const { n } = req.query;

    // Sort accounts by total transaction value in descending order, then by accountId alphabetically.
    db('accounts')
    .select('*')
    .orderBy('balance', 'desc')
    .orderBy('account_id', 'asc')
    .limit(n)
    .then(data => res.status(201).json(data))
    .catch(err => res.status(400).json(`Failed to fetch top ${n} accounts.`));
}

module.exports = {
    handleTopActivity: handleTopActivity
}