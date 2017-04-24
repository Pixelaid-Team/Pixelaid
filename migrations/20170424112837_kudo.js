
exports.up = function(knex, Promise) {
  return knex.schema.createTable('kudo', (table) => {
    table.increments()
    table.string('body')
    table.integer('to_user_id').references('id').inTable('user')
    table.integer('from_user_id').references('id').inTable('user')
    table.integer('votes')
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('kudo')
};
