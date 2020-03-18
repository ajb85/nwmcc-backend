const db = require('../index.js');

module.exports = {
  find,
  create,
  join,
  edit,
  remove
};

const table = 'chats';

function find(filter) {
  // Find chats based on an attribute
  if (!filter) {
    // For privacy, cannot get all chats--there must be a filter
    return null;
  }

  return db('chats as c')
    .select(
      'c.id',
      'c.name',
      db.raw(
        "array_agg(json_build_object('id', u.id, 'nickname', u.nickname)) as members"
      )
    )
    .where(filter)
    .leftJoin('users_in_chat as uc', { 'c.id': 'uc.chat_id' })
    .leftJoin('users as u', { 'uc.user_id': 'u.id' })
    .groupBy('u.id', 'c.id');
}

function create(data) {
  return db(table)
    .insert(data, ['*'])
    .then(([{ id }]) => find({ 'c.id': id }).first());
}

function join(user_id, chat_id) {
  if (!user_id || !chat_id) {
    return null;
  }

  return db('users_in_chat')
    .insert({ user_id, chat_id })
    .then(_ => find({ 'c.id': chat_id }).first());
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
        updated.map(({ id }) => find({ id }).first())
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
