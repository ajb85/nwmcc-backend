const router = require('express').Router();
const generateToken = require('config/generateToken.js');
const { verifyNewAccount, verifyLogin } = require('middleware/users.js');
const auth = require('middleware/authenticate.js');

const Users = require('models/queries/users.js');
const Chats = require('models/queries/chats.js');

router.get('/', auth, (req, res) => {
  const { user } = res.locals;

  return res.status(200).json({ ...user });
});

router.post('/register', verifyNewAccount, async (req, res) => {
  const { email, password, nickname } = req.body;

  const newUser = await Users.create({ email, password, nickname });

  if (newUser) {
    // Join default chat by....default
    await Chats.join(newUser.id, 1);
    const token = generateToken(newUser);
    return res.status(201).json({ ...newUser, token });
  }
});

router.post('/login', verifyLogin, async (req, res) => {
  const token = generateToken(res.locals.user);
  return res.status(200).json({ ...res.locals.user, token });
});

module.exports = router;
