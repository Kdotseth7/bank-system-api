const handleCreateAccount = (req, res, db) => {
    const { timestamp, account_id } = req.query;
    let new_account = null;
    console.log(accounts);
    try {
        // Create a new account with a balance of 0 if it doesn't exist.
        if (!accounts.some(account => account.account_id === account_id)) {
            new_account = {
                "account_id": account_id,
                "timestamp": timestamp.toString(), 
                "balance": 0
            }
            accounts.push(new_account);
        }
        // return "true"
        res.send(new_account)
    } catch (err) {
        // return "false"
        res.send("Account creation failed.")
    }    
}

module.exports = {
    handleCreateAccount: handleCreateAccount
}