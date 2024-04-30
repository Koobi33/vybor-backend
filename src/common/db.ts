const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'Ro0TU$$eR_n1gGa',
  port: 5432, // Default PostgreSQL port
});

module.exports = pool;