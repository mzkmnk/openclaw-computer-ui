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

  async createTask(input: Omit<CreateTaskInput, 'title'> & { title?: string }) {
    const title = input.title?.trim() || this.makeDefaultTitle(input.prompt);

    return this.taskRepository.create({
      title,
      prompt: input.prompt,
      mode: input.mode
    });
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

  private makeDefaultTitle(prompt: string): string {
    const text = prompt.trim();
    if (text.length <= 64) {
      return text;
    }
    return `${text.slice(0, 61)}...`;
  }
}
