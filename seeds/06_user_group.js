
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('user_group').del()
    .then(function () {
      // Inserts seed entries
      return knex('user_group').insert([
        {
          user_id: 1,
          group_id: 1
        },
        {
          user_id: 2,
          group_id: 1
        },
        {
          user_id: 3,
          group_id:1
        }
      ]);
    });
};
