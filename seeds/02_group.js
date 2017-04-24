
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('user').del()
    .then(function () {
      // Inserts seed entries
      return knex('user').insert([
        {
          name: "g46"
        },
        {
          name: "g51"
        },
        {
          name: "g38",
        }
      ]);
    });
};
