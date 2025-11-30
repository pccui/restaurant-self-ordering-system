import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { env } from './config/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable cookie parsing for JWT auth
  app.use(cookieParser());

  // Enable CORS for frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  app.setGlobalPrefix('api');
  await app.listen(env.PORT);
  console.log(`Backend listening on http://localhost:${env.PORT} (${env.NODE_ENV} mode)`);
}
bootstrap();
