import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const allowedOrigins = new Set(
    (process.env.CORS_ORIGIN ?? '')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  );

  app.enableCors({
    origin: (
      requestOrigin: string | undefined,
      callback: (error: Error | null, allow?: boolean) => void,
    ) => {
      if (!requestOrigin || allowedOrigins.has(requestOrigin)) {
        callback(null, true);
        return;
      }

      let parsedOrigin: URL;
      try {
        parsedOrigin = new URL(requestOrigin);
      } catch {
        callback(null, false);
        return;
      }

      const isVercelOrigin =
        parsedOrigin.protocol === 'https:' &&
        /^english-exam-prep[^.]*\.vercel\.app$/.test(parsedOrigin.hostname);
      const isLocalOrigin =
        parsedOrigin.protocol === 'http:' &&
        parsedOrigin.hostname === 'localhost' &&
        parsedOrigin.port === '3000';

      callback(null, isVercelOrigin || isLocalOrigin);
    },
    credentials: true,
  });

  const port = Number(process.env.PORT ?? process.env.API_PORT ?? 3001);
  await app.listen(port, '0.0.0.0');
  Logger.log(`API listening on 0.0.0.0:${port}`, 'Bootstrap');
}

void bootstrap();
