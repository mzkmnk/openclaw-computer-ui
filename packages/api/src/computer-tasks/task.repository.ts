import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { createDb } from '../db/client.js';
import { tasks } from '../db/schema.js';
import {
  type CreateTaskInput,
  type TaskEntity,
  type TaskStatus
} from './task.types.js';

export interface TaskRepository {
  create(input: CreateTaskInput): Promise<TaskEntity>;
  findMany(status?: TaskStatus): Promise<TaskEntity[]>;
  findById(id: string): Promise<TaskEntity | null>;
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required to initialize TaskRepository');
}

const { db } = createDb(databaseUrl);

@Injectable()
export class DrizzleTaskRepository implements TaskRepository {
  async create(input: CreateTaskInput): Promise<TaskEntity> {
    const [created] = await db
      .insert(tasks)
      .values({
        title: input.title,
        prompt: input.prompt,
        mode: input.mode,
        status: 'queued'
      })
      .returning();

    return created;
  }

  async findMany(status?: TaskStatus): Promise<TaskEntity[]> {
    if (!status) {
      return db.select().from(tasks);
    }
    return db.select().from(tasks).where(eq(tasks.status, status));
  }

  async findById(id: string): Promise<TaskEntity | null> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task ?? null;
  }
}
