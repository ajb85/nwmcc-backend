exports.up = function(knex) {
  return knex.schema.createTable('users', tbl => {
    tbl.increments();
    tbl
      .text('email')
      .notNullable()
      .unique();
    tbl
      .text('nickname')
      .notNullable()
      .unique();
    tbl.text('password').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
