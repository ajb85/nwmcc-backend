const Users = require('models/queries/users.js');

module.exports = {
  verifyAccountInfo
};

async function verifyAccountInfo(req, res, next) {
  const { email, password, nickname } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: 'Email & password are required for this action.' });
  }

  if (nickname) {
    // User is registering an account
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
  }

  next();
}
