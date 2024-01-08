const Mocha = require('mocha');
const http = require('http');
const fg = require('fast-glob'); // Importing fast-glob instead of glob
// const express = require('express');
// const app = express();
const app = require('../server');

// Configuration for Mocha: global timeout and retries
const mocha = new Mocha({
    timeout: 30000, // Global timeout of 30 seconds for all tests.
    retries: 2      // Global retry count for all tests.
});

// // Specify the port
// const PORT = 3003;

// Create an HTTP server with your application
const server = http.createServer(app);

// Start the server on the specified port
// server.listen(PORT, () => {
//     console.log(`Test server listening on port ${PORT}`);
// });

// Handle server errors (like port already in use)
server.on('error', (error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});

// Using fast-glob to add all test files dynamically
fg("./test/**/*.js").then(files => {
    // Add each test file to the Mocha instance
    files.forEach(file => mocha.addFile(file));

    // Run the tests
    mocha.run(failures => {
        // Close the server after tests
        server.close();

        // Exit with a status code indicating success or failure
        process.exit(failures ? 1 : 0);
    });
}).catch(err => {
    console.error('Error finding test files:', err);
    process.exit(1);
});
