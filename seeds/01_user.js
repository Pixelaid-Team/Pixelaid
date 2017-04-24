
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('user').del()
    .then(function () {
      // Inserts seed entries
      return knex('user').insert([
        {
        name: "admin",
        username: "admin",
        email: "admin@gmail.com",
        password: "keyboardcat",
        admin: true,
        pixel_count: 100000,
        picture_id: 1,
        timestamp: "Today"
        },
        {
          name: "devin",
          username: "devin-h",
          email: "devin@gmail.com",
          password: "keyboardcat",
          admin: false,
          pixel_count: 50,
          picture_id: 1,
          timestamp: "Today"

        },
        {
          name: "Jordan",
          username: "jordan-f",
          email: "jordan@gmail.com",
          password: "keyboardcat",
          admin: false,
          pixel_count: 50,
          picture_id: 1,
          timestamp: "Today"
        }
      ]);
    });
};
