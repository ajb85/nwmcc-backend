const Users = require('models/queries/users.js');

module.exports = {
  verifyAccountInfo,
  verifyLogin
};

async function verifyNewAccount(req, res, next) {
  const { email, password, nickname } = req.body;

  if (!email || !password || !nickname) {
    // Could expand to add minimum character length, etc
    // For this tiny example app, I'm not too concerned about it
    return res.status(400).json({
      message: 'Email, password, and nickname are required for this action.'
    });
  }

  const emailExists = await Users.find({ email }).first();
  const nicknameExists = await Users.find({ nickname }).first();

  if (emailExists) {
    return res.status(400).json({
      route: 'account/create',
      message: 'An account with that email address already exists.'
    });
  }

  if (nicknameExists) {
    return res.status(400).json({
      route: 'account/create',
      message: 'That nickname is already taken.'
    });
  }

  next();
}

function verifyLogin(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: 'Email and password are required to login'
    });
  }

  next();
}
