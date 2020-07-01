import path from 'path';

module.exports = {
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: '097531',
    database: 'ecoleta_db',
  },
  // pool: {
  //   max: 20
  // },
  migrations: {
    directory: path.resolve(__dirname, 'src', 'database', 'migrations')
  },
  seeds: {
    directory: path.resolve(__dirname, 'src', 'database', 'seeds')
  },
  useNullAsDefault: true
}