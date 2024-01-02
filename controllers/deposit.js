const { accounts } = require('../data/accounts.json');

const handleDeposit = (req, res) => {
    const { account_id, amount } = req.query;
    // Deposit money into the given account if it exists.
    if (account_id in accounts) {
        accounts[account_id] += amount
        return "true"
    } else {
        return ""
    }
}

module.exports = {
    handleDeposit: handleDeposit
}