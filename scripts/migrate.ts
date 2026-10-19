/**
 * Apply scripts/migrate.sql to the database in DATABASE_URL.
 * Run: npm run migrate
 * (Requires DATABASE_URL in .env.local)
 */
import { config } from 'dotenv';
import path from 'path';
import { readFileSync } from 'fs';

// Load .env.local
config({ path: path.resolve(process.cwd(), '.env.local') });

import { Pool } from 'pg';

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL is not set — add it to .env.local');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString,
    ssl: connectionString.includes('neon.tech')
      ? { rejectUnauthorized: false }
      : false,
  });

  const schemaPath = path.resolve(process.cwd(), 'scripts/migrate.sql');
  const sql = readFileSync(schemaPath, 'utf8');

  try {
    await pool.query(sql);
    console.log('✓ Schema applied from scripts/migrate.sql');
  } finally {
    await pool.end();
  }
}

main().catch(err => {
  console.error('Migration failed:', err instanceof Error ? err.message : err);
  process.exit(1);
});
