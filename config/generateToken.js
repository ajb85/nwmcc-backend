const jwt = require('jsonwebtoken');
const secret = require('./secret.js');

module.exports = userData => {
  const { password, ...user } = userData;
  const payload = { ...user };

  const options = {
    expiresIn: '8h'
  };

  return jwt.sign(payload, secret, options);
};
