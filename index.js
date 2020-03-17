// Import environment variables
require('dotenv').config();

// Automate error handling for error codes >= 500
require('express-async-errors');

// Allow absolute imports (server.js vs ./server.js)
require('app-module-path').addPath(__dirname);

const server = require('server.js');
server.listen((port = process.env.PORT || 4500), () =>
  console.log(`\n** Running on port ${port} **\n`)
);
