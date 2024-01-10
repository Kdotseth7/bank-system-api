# Egen Bank System API Documentation

Welcome to the Bank System API Documentation. Developed using Express.js, Node.js, and Knex.js, this API provides a powerful platform for managing bank operations including account creation, transactions, and inquiries.

Its been deployed using AWS EC2 Instance and used AWS RDS instance as its Database. I have also developed a Jenkins Pipeline that Builds, Deploys and Runs tests for this backend server.

## Technologies Used

- **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express.js**: A minimal and flexible Node.js web application framework.
- **Knex.js**: A SQL query builder for JavaScript, used to interact with the database, PSQL in this case.

## Endpoints Overview

### <u>BASE URL of AWS EC2 Instance</u> -> **54.68.233.161**

### 1. CREATE ACCOUNT - POST `accounts/create_account?account_id={{account_id}}`

**Description:** Create a new bank account with the specified account ID.

- **Parameters**:
  - `account_id`: The unique identifier for the new account.

---

### 2. DEPOSIT - POST `accounts/deposit?account_id={{account_id}}&amount={{amount}}`

**Description:** Deposit a specified amount into an account.

- **Parameters**:
  - `account_id`: The unique identifier for the account.
  - `amount`: The amount to deposit.

---

### 3. PAY - POST `accounts/pay?account_id={{account_id}}&amount={{amount}}`

**Description:** Make a payment of a specified amount from an account.

- **Parameters**:
  - `account_id`: The unique identifier for the account.
  - `amount`: The amount to pay.

---

### 4. TOP ACTIVITY - GET `accounts/top_activity?n={{number}}`

**Description:** Retrieve a list of the top 'n' accounts sorted by transaction activity.

- **Parameters**:
  - `n`: The number of top active accounts to retrieve.

---

### 5. TRANSFER - POST `transfers/transfer?source_id={{source_id}}&target_id={{target_id}}&amount={{amount}}`

**Description:** Transfer a specified amount from a source account to a target account.

- **Parameters**:
  - `source_id`: The unique identifier for the source account.
  - `target_id`: The unique identifier for the target account.
  - `amount`: The amount to transfer.

---

### 6. ACCEPT TRANSFER - POST `transfers/accept_transfer?account_id={{account_id}}&transfer_id={{transfer_id}}`

**Description:** Accept an incoming transfer to an account.

- **Parameters**:
  - `account_id`: The unique identifier for the account accepting the transfer.
  - `transfer_id`: The unique identifier for the transfer to accept.

## Usage & Notes

- Replace `{{account_id}}`, `{{amount}}`, `{{number}}`, `{{source_id}}`, `{{target_id}}`, and `{{transfer_id}}` with actual values when making requests.
- Ensure the correct HTTP method (GET or POST) is used for each endpoint.
- POST requests require a JSON body with necessary parameters.
- GET requests may require path variables or query parameters.
- Responses are typically in JSON format with relevant information.

Refer to the specific endpoint documentation for detailed information on request parameters, response structures, and possible errors. This guide provides an overview of the available operations and the technologies used.
