import { describe, expect, it, vi } from 'vitest';

import { type TaskRepository } from './task.repository.js';
import { TaskService } from './task.service.js';
import { type TaskEntity } from './task.types.js';

function mockTask(overrides: Partial<TaskEntity> = {}): TaskEntity {
  return {
    id: 'f8d5f6a5-7db6-42a6-b3ee-f87fa14989e9',
    title: 'title',
    prompt: 'prompt',
    mode: 'manual',
    status: 'queued',
    runnerHint: null,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    ...overrides
  };
}

describe('TaskService', () => {
  it('creates task with queued status via repository', async () => {
    const created = mockTask();
    const repository: TaskRepository = {
      create: vi.fn().mockResolvedValue(created),
      findMany: vi.fn(),
      findById: vi.fn()
    };
    const service = new TaskService(repository);

    await service.createTask({
      prompt: 'run smoke',
      mode: 'manual'
    });

    expect(repository.create).toHaveBeenCalledWith({
      title: 'run smoke',
      prompt: 'run smoke',
      mode: 'manual'
    });
  });

  it('filters tasks by status when provided', async () => {
    const repository: TaskRepository = {
      create: vi.fn(),
      findMany: vi.fn().mockResolvedValue([]),
      findById: vi.fn()
    };
    const service = new TaskService(repository);

    await service.listTasks('queued');

    expect(repository.findMany).toHaveBeenCalledWith('queued');
  });

  it('throws when task does not exist', async () => {
    const repository: TaskRepository = {
      create: vi.fn(),
      findMany: vi.fn(),
      findById: vi.fn().mockResolvedValue(null)
    };
    const service = new TaskService(repository);

    await expect(
      service.getTaskById('f8d5f6a5-7db6-42a6-b3ee-f87fa14989e9')
    ).rejects.toMatchObject({
      response: {
        code: 'TASK_NOT_FOUND'
      }
    });
  });
});
