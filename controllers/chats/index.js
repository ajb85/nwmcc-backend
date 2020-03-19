const router = require('express').Router();

const Chats = require('models/queries/chats.js');
const Messages = require('models/queries/messages.js');

const sockets = require('sockets/');

const {
  verifyUserInChat,
  verifyUserNotInChat,
  verifyContent
} = require('middleware/chats.js');

router.get('/byUser', async (req, res) => {
  const { id } = res.locals.user;
  const userChats = await Chats.find({ 'u.id': id });

  return res.status(200).json(userChats);
});

router.get('/:chat_id/messages', verifyUserInChat, async (req, res) => {
  const { chat_id } = req.params;
  const messages = await Messages.find({ 'c.id': chat_id });

  // The column-reverse used on the frontend means it's best to display
  // the messages in reverse order, thus I reverse before sending back
  return res.status(200).json({ messages, limit: process.env.CHAT_MSG_LIMIT });
});

router.post('/:chat_id/join', verifyUserNotInChat, async (req, res) => {
  const { chat_id } = req.params;
  const { id: user_id } = res.locals.user;

  const newChat = await Chats.join(user_id, chat_id);

  return res.status(201).json(newChat);
});

router.post(
  '/:chat_id/message',
  verifyUserInChat,
  verifyContent,
  async (req, res) => {
    const { content } = req.body;
    const { id: user_id } = res.locals.user;
    const { chat_id } = req.params;

    const newMessage = await Messages.create({ content, chat_id, user_id });

    sockets.emitToRoom(newMessage.chat_id, 'newMessage', newMessage);

    return res.sendStatus(201);
  }
);

module.exports = router;
