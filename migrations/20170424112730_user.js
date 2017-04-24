
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', (table) => {
    table.increments()
    table.string('name').notNull()
    table.string('username').unique()
    table.string('email').unique()
    table.string('password').notNull()
    table.boolean('admin')
    table.integer('pixel_count')
    table.integer('picture_id').references('id').inTable('profile_picture')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users')
};
