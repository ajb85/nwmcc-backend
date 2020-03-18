const jwt = require('jsonwebtoken');
const secret = require('config/secret.js');
const Users = require('models/queries/users.js');

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  jwt.verify(token, secret, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const { id, email, nickname } = decodedToken;
    res.locals.user = { id, email, nickname };
    next();
  });
};
