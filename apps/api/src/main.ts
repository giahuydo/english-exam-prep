import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import type { Request } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const configuredOrigins = new Set(
    (process.env.CORS_ORIGIN ?? '')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  );

  app.enableCors({
    origin: (requestOrigin: string | undefined, _request: Request) => {
      if (!requestOrigin || requestOrigin === 'http://localhost:3000') {
        return true;
      }

      if (configuredOrigins.has(requestOrigin)) {
        return true;
      }

      try {
        const url = new URL(requestOrigin);
        return (
          url.protocol === 'https:' &&
          /^english-exam-prep[^.]*\.vercel\.app$/.test(url.hostname)
        );
      } catch {
        return false;
      }
    },
    credentials: true,
  });

  const port = Number(process.env.PORT ?? process.env.API_PORT ?? 3001);
  await app.listen(port, '0.0.0.0');
  Logger.log(`API listening on 0.0.0.0:${port}`, 'Bootstrap');
}

void bootstrap();
