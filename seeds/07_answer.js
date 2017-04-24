
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('kudo').del()
    .then(function () {
      // Inserts seed entries
      return knex('kudo').insert([
        {
        body: "Hey thanks for help on the ERD's",
        question_id: 1,
        user_id: 1,
        votes: 5,
        created_at: "Today"
        },
        {
        body: "Hey thanks for help on the ERD's",
        question_id: 2,
        user_id: 3,
        votes: 5,
        created_at: "Today"

        },
        {
        body: "Hey thanks for help on the ERD'sn",
        question_id: 3,
        user_id: 2,
        votes: 5,
        created_at: "Today"
        }
      ]);
    });
};
