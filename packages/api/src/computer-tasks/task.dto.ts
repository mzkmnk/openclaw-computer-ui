import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MinLength
} from 'class-validator';

import {
  TASK_MODES,
  TASK_STATUSES,
  type TaskMode,
  type TaskStatus
} from './task.types.js';

export class CreateTaskRequestDto {
  @ApiProperty({ example: 'Terraform plan for dev' })
  @IsString()
  @MinLength(1)
  title!: string;

  @ApiProperty({ example: 'Run terraform plan against dev workspace' })
  @IsString()
  @MinLength(1)
  prompt!: string;

  @ApiProperty({ enum: TASK_MODES, example: 'manual' })
  @IsEnum(TASK_MODES)
  mode!: TaskMode;
}

export class ListTasksQueryDto {
  @ApiPropertyOptional({ enum: TASK_STATUSES })
  @IsOptional()
  @IsEnum(TASK_STATUSES)
  status?: TaskStatus;
}

export class TaskIdParamDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  id!: string;
}
