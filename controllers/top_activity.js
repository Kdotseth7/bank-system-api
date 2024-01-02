const handleTopActivity = (req, res, db) => {
    const { n } = req.query;
    // Sort accounts by total transaction value in descending order, then by accountId alphabetically.
    const sorted_accounts = Object.entries(accounts).sort((a, b) => {
        if (a[1] === b[1]) {
            return a[0].localeCompare(b[0])
        } else {
            return b[1] - a[1]
        }
    })
    // sorted_accounts = sorted(self.transaction_totals.items(), key=lambda x: (-x[1], x[0]))
    const top_accounts = sorted_accounts.slice(0, n)
    // return ', '.join([f"{acc_id}({total})" for acc_id, total in top_accounts])
    return top_accounts.map(account => `${account[0]}(${account[1]})`).join(', ')
}

module.exports = {
    handleTopActivity: handleTopActivity
}