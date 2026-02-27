import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

import { TaskController } from './computer-tasks/task.controller.js';
import { DrizzleTaskRepository } from './computer-tasks/task.repository.js';
import { TASK_REPOSITORY, TaskService } from './computer-tasks/task.service.js';
import { HealthController } from './health.controller.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        API_PORT: Joi.number().port().default(4000),
        DATABASE_URL: Joi.string()
          .uri({ scheme: ['postgres', 'postgresql'] })
          .required(),
        CORS_ORIGIN: Joi.string().default('http://localhost:3000'),
        SWAGGER_ENABLED: Joi.boolean()
          .truthy('true')
          .falsy('false')
          .default(false),
        NODE_ENV: Joi.string()
          .valid('development', 'test', 'production')
          .default('development')
      })
    })
  ],
  controllers: [HealthController, TaskController],
  providers: [
    TaskService,
    {
      provide: TASK_REPOSITORY,
      useClass: DrizzleTaskRepository
    }
  ]
})
export class AppModule {}
