const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

// Routes
const userRoutes = require('controllers/users/');
const chatRoutes = require('controllers/chats/');

// Middleware
const errorHandler = require('middleware/errorHandling.js');
const auth = require('middleware/authenticate.js');

server.use('/account', userRoutes);
server.use('/chats', auth, chatRoutes);

server.get('/', (req, res) => {
  return res.status(200).send('Server is online!');
});

//async error handling middleware MUST come after routes or else will just throw Type error
server.use(errorHandler);

module.exports = require('http').createServer(server);
