import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

import { HealthController } from './health.controller.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        API_PORT: Joi.number().port().default(4000),
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
  controllers: [HealthController]
})
export class AppModule {}
