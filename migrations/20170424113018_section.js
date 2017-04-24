
exports.up = function(knex, Promise) {
  return knex.schema.createTable('section', (table) => {
    table.increments()
    table.integer('canvas_id').references('id').inTable('canvas')
    table.string('row_0')
    table.string('row_1')
    table.string('row_2')
    table.string('row_3')
    table.string('row_4')
    table.string('row_5')
    table.string('row_6')
    table.string('row_7')
    table.string('row_8')
    table.string('row_9')
    table.string('row_10')
    table.string('row_11')
    table.string('row_12')
    table.string('row_13')
    table.string('row_14')
    table.string('row_15')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('section')
};
