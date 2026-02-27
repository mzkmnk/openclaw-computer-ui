export const TASK_MODES = ['manual', 'auto'] as const;
export type TaskMode = (typeof TASK_MODES)[number];

export const TASK_STATUSES = [
  'queued',
  'running',
  'succeeded',
  'failed',
  'cancelled'
] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export type TaskEntity = {
  id: string;
  title: string;
  prompt: string;
  mode: TaskMode;
  status: TaskStatus;
  runnerHint: unknown;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateTaskInput = {
  title: string;
  prompt: string;
  mode: TaskMode;
};
