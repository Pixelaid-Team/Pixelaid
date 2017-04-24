
exports.up = function(knex, Promise) {
  return knex.schema.createTable('group', (table) => {
    table.increments()
    table.string('name')
  })
};

exports.down = function(knex, Promise) {

};
