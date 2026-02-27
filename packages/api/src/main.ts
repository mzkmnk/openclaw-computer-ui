import 'reflect-metadata';

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module.js';
import { HttpExceptionFilter } from './common/http-exception.filter.js';
import { assertDatabaseConnection } from './db/health.js';

function parseCorsOrigins(value: string): string[] {
  const origins = value
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  if (origins.some((origin) => origin === '*')) {
    throw new Error(
      'CORS_ORIGIN must not contain "*" when credentials are enabled.'
    );
  }

  return origins;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const corsOrigins = parseCorsOrigins(
    config.getOrThrow<string>('CORS_ORIGIN')
  );
  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void
    ) => {
      if (!origin || corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS blocked origin: ${origin}`), false);
    },
    credentials: true
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true
    })
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  const nodeEnv = config.getOrThrow<string>('NODE_ENV');
  const swaggerEnabled =
    config.get<boolean>('SWAGGER_ENABLED', false) || nodeEnv !== 'production';
  if (swaggerEnabled) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('openclaw-computer-ui API')
      .setDescription('Issue #2 API scaffold')
      .setVersion('0.1.0')
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document);
  }

  const databaseUrl = config.getOrThrow<string>('DATABASE_URL');
  await assertDatabaseConnection(databaseUrl);

  const port = config.getOrThrow<number>('API_PORT');
  await app.listen(port);
}

void bootstrap();
