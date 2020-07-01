import knex from 'knex';

const connection = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: '097531',
    database: 'ecoleta_db',
  },
  useNullAsDefault: true 
});

export default connection;