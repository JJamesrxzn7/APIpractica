// Configuracion centralizada; los valores se leen del archivo .env o de variables de entorno.
require('dotenv').config();

module.exports = {
  port: Number(process.env.PORT) || 3000,
  apiToken: process.env.API_TOKEN || 'secreto123',
  maxPageSize: 100,
  db: {
    host: process.env.PGHOST || 'localhost',
    port: Number(process.env.PGPORT) || 5432,
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'postgres',
    database: process.env.PGDATABASE || 'postgres',
  },
};
