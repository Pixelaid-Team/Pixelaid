
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('profile_picture').del()
    .then(function () {
      // Inserts seed entries
      return knex('profile_picture').insert([
        {
          row_1:"YGYGYGYGYGYGYGYG",
          row_2:"GYGYGYGYGYGYGYGY",
          row_3:"YGYGYGYGYGYGYGYG",
          row_4:"GYGYGYGYGYGYGYGY",
          row_5:"YGYGYGYGYGYGYGYG",
          row_6:"GYGYGYGYGYGYGYGY",
          row_7:"YGYGYGYGYGYGYGYG",
          row_8:"GYGYGYGYGYGYGYGY",
          row_9:"YGYGYGYGYGYGYGYG",
          row_10:"GYGYGYGYGYGYGYGY",
          row_11:"YGYGYGYGYGYGYGYG",
          row_12:"GYGYGYGYGYGYGYGY",
          row_13:"YGYGYGYGYGYGYGYG",
          row_14:"GYGYGYGYGYGYGYGY",
          row_15:"YGYGYGYGYGYGYGYG"
        }

      ]);
    });
};
