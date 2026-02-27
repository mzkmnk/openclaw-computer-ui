import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import {
  CreateTaskRequestDto,
  ListTasksQueryDto,
  TaskIdParamDto
} from './task.dto.js';
import { TaskService } from './task.service.js';

@ApiTags('computer-tasks')
@Controller('api/computer/tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'Create task' })
  create(@Body() body: CreateTaskRequestDto) {
    return this.taskService.createTask(body);
  }

  @Get()
  @ApiOperation({ summary: 'List tasks' })
  @ApiQuery({ name: 'status', required: false })
  list(@Query() query: ListTasksQueryDto) {
    return this.taskService.listTasks(query.status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task detail' })
  @ApiParam({ name: 'id', format: 'uuid' })
  detail(@Param() params: TaskIdParamDto) {
    return this.taskService.getTaskById(params.id);
  }
}
