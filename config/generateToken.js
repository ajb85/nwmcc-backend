const jwt = require('jsonwebtoken');
const secret = require('./secret.js');

module.exports = user => {
  const payload = { ...user };

  const options = {
    expiresIn: '8h'
  };

  return jwt.sign(payload, secret, options);
};
