
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('question').del()
    .then(function () {
      // Inserts seed entries
      // return knex('question').insert([
      //   {
      //   title: "Hey thanks for help on the ERD's",
      //   body: "hey where is the data model for users",
      //   user_id: 1,
      //   created_at: "Today"
      //   },
      //   {
      //   title: "Hey thanks for help on the ERD's",
      //   body: "hey where is the data model for users",
      //   user_id: 3,
      //   created_at: "Today"
      //
      //   },
      //   {
      //   title: "Hey thanks for help on the ERD'sn",
      //   body: "hey where is the data model for users",
      //   user_id: 2,
      //   created_at: "Today"
      //   }
      // ]);
    });
};
