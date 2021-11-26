const {env} = process;

const config = {
  db: {
    host: env.HOST, // || 'localhost',
    port: env.DB_PORT,
    user: env.DB_USER || 'postgres',
    password: env.DB_PASSWORD || '1234',
    database: env.DB_NAME || 'avon',
  },
  listPerPage: env.LIST_PER_PAGE || 10,
};

module.exports = config;