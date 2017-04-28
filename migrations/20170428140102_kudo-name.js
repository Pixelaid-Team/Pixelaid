exports.up = function(knex, Promise) {
  return knex.schema.createTable('kudo', (table) => {
    table.string("from")
    table.string("to")
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('kudo')
};
