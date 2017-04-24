
exports.up = function(knex, Promise) {
  return knex.schema.createTable('user_group', (table) => {
    table.increments()
    table.integer('user_id').references('id').inTable('user')
    table.integer('group_id').references('id').inTable('group')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('user_group')
};
