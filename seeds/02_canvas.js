
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('canvas').del()
    .then(function () {
      // Inserts seed entries
      return knex('canvas').insert([
        {
          group_id: 1
        },
        {
          group_id: 2
        },
        {
          group_id: 3
        }
      ]);
    });
};
