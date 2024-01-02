const { accounts } = require('../data/accounts.json');

const handlePay = (req, res) => {
    const { account_id, amount } = req.query;
    // Withdraw money from the given account if it exists and has sufficient funds.
    if (account_id in accounts && accounts[account_id] >= amount) {
        accounts[account_id] -= amount;
        return accounts[account_id].toString();
    } else {
        return ""
    }
}

module.exports = {
    handlePay: handlePay
}