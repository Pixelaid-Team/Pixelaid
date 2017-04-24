
exports.up = function(knex, Promise) {
  return knex.schema.createTable('answer', (table) => {
    table.increments()
    table.string('body').notNull()
    table.integer('question_id').references('id').inTable('question')
    table.integer('user_id').references('id').inTable('user')
    table.integer('votes')
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('answer')
};
