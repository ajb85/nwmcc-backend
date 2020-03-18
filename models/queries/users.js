const db = require('../index.js');

module.exports = {
  find,
  lookup,
  create,
  edit,
  remove
};

const table = 'users';

function find(filter) {
  // Find a user based on an attribute
  if (!filter) {
    // I never want to return all of my user data
    return null;
  }
  return db(table)
    .select('email', 'nickname')
    .where(filter);
}

function lookup(filter) {
  // More for internal use.  Returns the user's password, which
  // I want to ensure never gets sent back to a client
  if (!filter) {
    return null;
  }

  return db(table)
    .where(filter)
    .first();
}

function create(data) {
  return db(table)
    .insert(data, ['*'])
    .then(([{ id }]) => find({ id }).first());
}

function edit(newData, filter) {
  if (!filter) {
    return null;
  }

  return db(table)
    .where(filter)
    .update(newData, ['*'])
    .then(updated => {
      const fullData = updated.map(({ id }) => find({ id }).first());
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
