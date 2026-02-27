import { createDb } from './client.js';
import { tasks } from './schema.js';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required for db:smoke');
}

const { db, pool } = createDb(databaseUrl);

try {
  const inserted = await db
    .insert(tasks)
    .values({
      title: 'smoke-task',
      prompt: 'verify drizzle insert',
      mode: 'manual',
      status: 'queued',
      runnerHint: { source: 'db:smoke' }
    })
    .returning({ id: tasks.id });

  console.log(`Inserted task id=${inserted[0]?.id ?? 'unknown'}`);
} finally {
  await pool.end();
}
