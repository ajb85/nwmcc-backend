const Chats = require('models/queries/chats.js');

module.exports = {
  verifyUserInChat,
  verifyUserNotInChat
};

async function verifyUserInChat(req, res, next) {
  const { id: user_id } = res.locals.user;
  const { chat_id } = req.params;

  const isInChat = await Chats.find({
    'u.id': user_id,
    'c.id': chat_id
  }).first();

  if (!isInChat) {
    return res
      .status(400)
      .json({ route: 'chat/membership', message: 'You are not in that chat.' });
  }

  next();
}

async function verifyUserNotInChat(req, res, next) {
  const { id: user_id } = res.locals.user;
  const { chat_id } = req.params;

  const isInChat = await Chats.find({
    'u.id': user_id,
    'c.id': chat_id
  }).first();

  if (isInChat) {
    return res
      .status(400)
      .json({ route: 'chat/join', message: 'You are already in that chat.' });
  }

  next();
}
