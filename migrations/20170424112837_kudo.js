
exports.up = function(knex, Promise) {
  return knex.schema.createTable('kudo', (table) => {
    table.increments()
    table.string('body')
    table.integer('to_user_id').references('id').inTable('users')
    table.integer('from_user_id').references('id').inTable('users')
    table.integer('votes')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    // table.string("from")
    // table.string("to")
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('kudo')
};
