// Update with your config settings.

require('dotenv').config()

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/pixelaid'
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'pixelaid',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
