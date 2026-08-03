const { Pool } = require('pg');
require('dotenv').config();

// Connection pool - reused across the app for performance.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  // Log but don't crash the whole process on an idle client error.
  console.error('Unexpected PostgreSQL pool error:', err);
});

/**
 * Run a parameterized query. Always use placeholders ($1, $2, ...) -
 * never string-concatenate user input into SQL.
 */
async function query(text, params) {
  const start = Date.now();
  const res = await pool.query(text, params);
  if (process.env.NODE_ENV === 'development') {
    console.log('SQL executed', { text, duration: Date.now() - start, rows: res.rowCount });
  }
  return res;
}

/**
 * Get a client for multi-statement transactions.
 * Usage:
 *   const client = await getClient();
 *   try { await client.query('BEGIN'); ...; await client.query('COMMIT'); }
 *   catch (e) { await client.query('ROLLBACK'); throw e; }
 *   finally { client.release(); }
 */
async function getClient() {
  return pool.connect();
}

module.exports = { pool, query, getClient };
