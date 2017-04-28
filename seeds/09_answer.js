
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('answer').del()
    .then(function () {
      // // Inserts seed entries
      // return knex('answer').insert([
      //   {
      //   body: "Answer number 1",
      //   question_id: 1,
      //   user_id: 1,
      //   votes: 5,
      //   created_at: "Today",
      //   answer_username: "devin-hanaway"
      //   },
      //   {
      //   body: "answer number 2",
      //   question_id: 2,
      //   user_id: 3,
      //   votes: 5,
      //   created_at: "Today",
      //   answer_username: "devinDaDude"
      //
      //   },
      //   {
      //   body: "answe number 3",
      //   question_id: 3,
      //   user_id: 2,
      //   votes: 5,
      //   created_at: "Today",
      //   answer_username: "Taylor"
      //   }
      // ]);
    });
};
