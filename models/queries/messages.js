const db = require('../index.js');

module.exports = {
  find,
  create,
  edit,
  remove
};

const table = 'messages';

function find(filter) {
  // Find messages for a chat
  if (!filter) {
    // For privacy reason, I'm naturally not sending back all messages
    // to anyone
    return null;
  }
  return db('messages as m')
    .select('m.*', 'u.nickname as author')
    .where(filter)
    .join('users as u', { 'm.user_id': 'u.id' })
    .rightJoin('chats as c', { 'm.chat_id': 'c.id' })
    .orderBy('created_at', 'desc')
    .limit(parseInt(process.env.CHAT_MSG_LIMIT, 10) || 50);
}

function create(data) {
  return db(table)
    .insert(data, ['*'])
    .then(([{ id }]) => find({ 'm.id': id }).first());
}

function edit(newData, filter) {
  if (!filter) {
    return null;
  }

  return db(table)
    .where(filter)
    .update(newData, ['*'])
    .then(async updated => {
      const fullData = await Promise.all(
        updated.map(({ id }) => find({ 'm.id': id }).first())
      );
      return fullData.length === 1 ? fullData[0] : fullData;
    });
}

function remove(id) {
  if (!id) {
    return null;
  }

  return db(table)
    .where({ id })
    .del();
}
