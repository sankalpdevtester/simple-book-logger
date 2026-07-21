exports.id = '20230220143000_initial_migration';
exports.async = true;

exports.up = async (knex) => {
  await knex.schema.createTable('Book', (table) => {
    table.string('id').primary();
    table.string('title').notNullable();
    table.string('author').notNullable();
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('Book');
};