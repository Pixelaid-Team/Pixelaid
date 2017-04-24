
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('group').del()
    .then(function () {
      // Inserts seed entries
      return knex('group').insert([
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
