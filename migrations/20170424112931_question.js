
exports.up = function(knex, Promise) {
  return knex.schema.createTable('question', (table) => {
    table.increments()
    table.string('title').notNull()
    table.string('body')
    table.integer('user_id').references('id').inTable('users')
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('question')
};
