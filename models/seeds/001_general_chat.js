exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('chats')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('chats').insert([{ name: 'General' }]);
    });
};
