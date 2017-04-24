
exports.up = function(knex, Promise) {
  return knex.schema.createTable('user', (table) => {
    table.increments()
    table.string('name').notNull()
    table.string('username').unique()
    table.string('email').unique()
    table.string('password').notNull()
    table.boolean('admin')
    table.integer('pixel_count')
    table.integer('picture_id').references('id').inTable('profile_picture')
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('user')
};
