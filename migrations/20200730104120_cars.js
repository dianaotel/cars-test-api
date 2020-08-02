exports.up = function (knex) {
  return knex.schema
    .createTable('cars', function (table) {
      table.increments('id')
      table.string('make').notNullable()
      table.boolean('model').notNullable()
      table.boolean('year').notNullable()
      table.boolean('colour').notNullable()
    })
}

/* istanbul ignore next */
exports.down = function (knex) {
  return knex.schema
    .dropTable('cars')
}
