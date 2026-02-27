import { sql } from 'drizzle-orm';

import { createDb } from './client.js';

export async function assertDatabaseConnection(databaseUrl: string) {
  const { db, pool } = createDb(databaseUrl);

  try {
    await db.execute(sql`select 1`);
  } catch (error) {
    throw new Error(
      `Failed to connect to Postgres using DATABASE_URL. ${String(error)}`
    );
  } finally {
    await pool.end();
  }
}
