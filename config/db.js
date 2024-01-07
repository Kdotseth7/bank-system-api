const knex = require('knex');
require('dotenv').config({
    path: process.env.NODE_ENV === 'prod' ? '.env.prod' : '.env.dev'
});

// Define base configuration
const dbConfig = {
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 5432 // Default PostgreSQL port
    }
};

// Conditionally add SSL configuration for production environment
if (process.env.NODE_ENV === 'prod') {
    dbConfig.connection.ssl = {
        rejectUnauthorized: false
    };
}

// Create the database connection using the configuration
const db = knex(dbConfig);

// // Test DB connection
// db.raw('SELECT * FROM accounts').then(data => console.log(data.rows));

// Export the database connection
module.exports = db;