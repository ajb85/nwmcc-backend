exports.up = function(knex) {
  return knex.schema
    .createTable('chats', tbl => {
      tbl.increments();
      tbl.text('name');
      tbl.timestamps(true, true);
    })
    .createTable('messages', tbl => {
      tbl.increments();
      tbl
        .integer('user_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      tbl
        .integer('chat_id')
        .notNullable()
        .references('id')
        .inTable('chats')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      tbl.text('content');
      tbl.timestamps(true, true);
    })
    .createTable('users_in_chat', tbl => {
      tbl.increments();
      tbl
        .integer('user_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      tbl
        .integer('chat_id')
        .notNullable()
        .references('id')
        .inTable('chats')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      tbl.timestamps(true, true);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('users_in_chat')
    .dropTable('messages')
    .dropTable('chats');
};
