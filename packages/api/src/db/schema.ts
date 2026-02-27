import {
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  index
} from 'drizzle-orm/pg-core';

export const tasks = pgTable('tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  prompt: text('prompt').notNull(),
  mode: text('mode').notNull(),
  status: text('status').notNull(),
  runnerHint: jsonb('runner_hint'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
});

export const taskEvents = pgTable(
  'task_events',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    taskId: uuid('task_id')
      .notNull()
      .references(() => tasks.id, { onDelete: 'cascade' }),
    ts: timestamp('ts', { withTimezone: true }).defaultNow().notNull(),
    type: text('type').notNull(),
    payload: jsonb('payload').notNull()
  },
  (table) => [index('task_events_task_id_idx').on(table.taskId)]
);

export const approvals = pgTable(
  'approvals',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    taskId: uuid('task_id')
      .notNull()
      .references(() => tasks.id, { onDelete: 'cascade' }),
    action: text('action').notNull(),
    status: text('status').notNull(),
    requestedAt: timestamp('requested_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    resolvedAt: timestamp('resolved_at', { withTimezone: true }),
    note: text('note')
  },
  (table) => [index('approvals_task_id_idx').on(table.taskId)]
);
