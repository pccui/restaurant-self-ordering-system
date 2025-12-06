import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { env } from './config/env';

import { prisma } from './lib/prisma';

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

/**
 * Attempt to connect to the database with retry logic
 * Uses an actual query to verify the connection works (not just $connect which is lazy)
 */
async function connectToDatabase(): Promise<void> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      // Actually query the database to verify connection works
      // $queryRaw with SELECT 1 is the most reliable way to test connectivity
      await prisma.$queryRaw`SELECT 1`;
      console.log('✅ Database connection successful');
      return;
    } catch (error) {
      console.error(`❌ Database connection attempt ${attempt}/${MAX_RETRIES} failed`);

      if (attempt === MAX_RETRIES) {
        console.error('❌ All database connection attempts failed!');
        console.error('Please make sure your database is running and accessible.');
        console.error('DATABASE_URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@')); // Hide password
        console.error(error);
        process.exit(1);
      }

      console.log(`⏳ Retrying in ${RETRY_DELAY_MS / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }
}

async function bootstrap() {
  // Check database connection with retry
  await connectToDatabase();

  const app = await NestFactory.create(AppModule);

  // Enable cookie parsing for JWT auth
  app.use(cookieParser());

  // Parse allowed origins from environment (supports multiple URLs for Vercel deployments)
  const allowedOrigins = process.env.FRONTEND_URLS
    ? process.env.FRONTEND_URLS.split(',').map(url => url.trim())
    : ['http://localhost:3000', 'http://127.0.0.1:3000']; // fallback for local dev

  // CORS configuration
  const corsOptions: CorsOptions = {
    origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
      // Allow requests with no origin (curl, Postman, server-to-server, etc.)
      if (!origin) return callback(null, true);

      // In development, allow all origins
      if (process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`❌ Blocked by CORS: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204,
  };

  app.enableCors(corsOptions);

  app.setGlobalPrefix('api');
  await app.listen(env.PORT);
  console.log(`Backend listening on http://localhost:${env.PORT} (${env.NODE_ENV} mode)`);
}
bootstrap();
