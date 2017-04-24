
exports.up = function(knex, Promise) {
  return knex.schema.createTable('section', (table) => {
    table.increments()
    table.integer('canvas_id').references('id').inTable('canvas')
  })
};

exports.down = function(knex, Promise) {

};
