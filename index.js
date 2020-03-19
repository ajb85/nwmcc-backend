// Import environment variables
require('dotenv').config();

// Automate error handling for error codes >= 500
require('express-async-errors');

// Allow absolute imports (server.js vs ./server.js)
require('app-module-path').addPath(__dirname);

require('api/api.js');
const http = require('api/http.js');
http.listen((port = process.env.PORT || 4500), () =>
  console.log(`\n** Running on port ${port} **\n`)
);
