import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MinLength
} from 'class-validator';

import { TASK_MODES, TASK_STATUSES } from './task.types.js';

export class CreateTaskRequestDto {
  @ApiPropertyOptional({ example: 'Terraform plan for dev' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: 'Run terraform plan against dev workspace' })
  @IsString()
  @MinLength(1)
  prompt!: string;

  @ApiProperty({ enum: TASK_MODES, example: 'manual' })
  @IsEnum(TASK_MODES)
  mode!: (typeof TASK_MODES)[number];
}

export class ListTasksQueryDto {
  @ApiPropertyOptional({ enum: TASK_STATUSES })
  @IsOptional()
  @IsEnum(TASK_STATUSES)
  status?: (typeof TASK_STATUSES)[number];
}

export class TaskIdParamDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  id!: string;
}
