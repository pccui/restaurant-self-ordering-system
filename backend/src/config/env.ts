import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url().startsWith('postgresql://'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3001),
  FRONTEND_URL: z.string().url().optional(),
});

export type Env = z.infer<typeof envSchema>;

// Validate environment variables at module load time
let env: Env;

try {
  env = envSchema.parse(process.env);
} catch (error: unknown) {
  if (error instanceof z.ZodError) {
    console.error('❌ Environment validation failed:');
    const zodError = error as z.ZodError;
    zodError.issues.forEach((issue) => {
      console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
    });
    console.error('\n💡 Please check your .env file against .env.example');
    process.exit(1);
  }
  throw error;
}

export { env };
