const knex = require('knex');

// DB connection
const db = knex({
    client: 'pg', 
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    }
});

if (process.env.node == 'prod') {
    db.connection.port = process.env.DB_PORT;
    db.connection.ssl = { rejectUnauthorized: false }
}

// Test DB connection
// db.raw('SELECT * FROM accounts').then(data => console.log(data.rows));

module.exports = db;