import { Pool } from 'pg';

/**
 * Initializes a PostgreSQL connection pool using environment variables.
 * This pool is reused across API routes to avoid exhausting connections.
 *
 * Environment variables expected:
 * - PGHOST: DATABASE HOST
 * - PGUSER: DATABASE USER
 * - PGDATABASE: DATABASE NAME
 * - PGPASSWORD: DATABASE PASSWORD
 * - PGPORT: DATABASE PORT
 *
 * SSL is enabled with `rejectUnauthorized: false` to support self-signed certs (e.g. on platforms like Heroku).
 */
const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  ssl: {
    rejectUnauthorized: false
  }
});

export default pool;