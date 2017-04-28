
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('kudo').del()
    .then(function () {
      // Inserts seed entries
      // return knex('kudo').insert([
      //   {
      //   body: "Hey thanks for help on the ERD's",
      //   to_user_id: 1,
      //   from_user_id: 1,
      //   votes: 5,
      //   created_at: "Today",
      //   from: "nick",
      //   to: "derek"
      //   },
      //   {
      //   body: "Hey thanks for help on the ERD's",
      //   to_user_id: 2,
      //   from_user_id: 3,
      //   votes: 5,
      //   created_at: "Today",
      //   from: "Lee",
      //   to: "Molly"
      //   },
      //   {
      //   body: "Hey thanks for help on the ERD'sn",
      //   to_user_id: 3,
      //   from_user_id: 2,
      //   votes: 5,
      //   created_at: "Today",
      //   from: "devin",
      //   to: "Taylor"
      //   }
      // ]);
    });
};
