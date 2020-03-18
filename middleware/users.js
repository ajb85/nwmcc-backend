const bcrypt = require('bcrypt');
const Users = require('models/queries/users.js');

module.exports = {
  verifyNewAccount,
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

  const isValidEmail = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  if (!isValidEmail.test(email)) {
    return res.status(400).json({
      route: 'account/register',
      message: 'Invalid email address.'
    });
  }

  // Not great to have to run two queries before every account creation
  // But it does allow me to have custom error messages and
  // while I could write a single query to handle this case,
  // I'm going to leave it at two for now because...48 hours :)
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

  req.body.password = bcrypt.hashSync(password, 10);
  next();
}

async function verifyLogin(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: 'Email and password are required to login'
    });
  }

  const user = await Users.lookup({ email });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({
      route: 'account/login',
      message: 'Invalid credentials'
    });
  }

  delete user.password;
  res.locals.user = user;
  next();
}
