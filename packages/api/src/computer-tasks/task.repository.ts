import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { eq } from 'drizzle-orm';
import { type NodePgDatabase } from 'drizzle-orm/node-postgres';

import * as schema from '../db/schema.js';
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

@Injectable()
export class DrizzleTaskRepository implements TaskRepository {
  private readonly db: NodePgDatabase<typeof schema>;

  constructor(configService: ConfigService) {
    const databaseUrl = configService.getOrThrow<string>('DATABASE_URL');
    const { db } = createDb(databaseUrl);
    this.db = db;
  }

  async create(input: CreateTaskInput): Promise<TaskEntity> {
    const [created] = await this.db
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
      return this.db.select().from(tasks);
    }
    return this.db.select().from(tasks).where(eq(tasks.status, status));
  }

  async findById(id: string): Promise<TaskEntity | null> {
    const [task] = await this.db.select().from(tasks).where(eq(tasks.id, id));
    return task ?? null;
  }
}
