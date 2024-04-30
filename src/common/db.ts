const { Pool } = require('pg');
import { env } from '@/common/utils/envConfig';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: env.BD_KEY,
  port: 5432, // Default PostgreSQL port
});

module.exports = pool;