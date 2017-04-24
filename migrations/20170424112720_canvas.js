
exports.up = function(knex, Promise) {
  return knex.schema.createTable('canvas', (table) => {
    table.increments()
    table.integer('group_id').references('id').inTable('groups')
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('canvas')
};
