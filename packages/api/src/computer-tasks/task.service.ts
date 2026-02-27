import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import {
  type CreateTaskInput,
  type TaskEntity,
  type TaskStatus
} from './task.types.js';
import { type TaskRepository } from './task.repository.js';

export const TASK_REPOSITORY = Symbol('TASK_REPOSITORY');

@Injectable()
export class TaskService {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepository
  ) {}

  async createTask(input: CreateTaskInput) {
    return this.taskRepository.create(input);
  }

  async listTasks(status?: TaskStatus): Promise<TaskEntity[]> {
    return this.taskRepository.findMany(status);
  }

  async getTaskById(id: string): Promise<TaskEntity> {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new NotFoundException({
        code: 'TASK_NOT_FOUND',
        message: `Task not found: ${id}`
      });
    }
    return task;
  }
}
