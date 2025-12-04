# Multi-stage Dockerfile for NestJS backend
# Optimized for Render deployment

# Build stage
FROM node:22-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

WORKDIR /app

# Copy workspace files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/shared/package.json ./packages/shared/
COPY backend/package.json ./backend/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY packages/shared ./packages/shared
COPY backend ./backend

# Build shared package first, then backend
RUN pnpm --filter @restaurant/shared build
RUN pnpm --filter backend build
RUN pnpm --filter backend exec prisma generate

# Production stage
FROM node:22-alpine AS runner

RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

WORKDIR /app

# Copy package files for production install
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/shared/package.json ./packages/shared/
COPY backend/package.json ./backend/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy built files
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/src/generated ./backend/src/generated
COPY --from=builder /app/backend/prisma ./backend/prisma

WORKDIR /app/backend

# Expose port
ENV PORT=10000
EXPOSE 10000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:10000/api/health || exit 1

# Start the application
CMD ["node", "dist/main.js"]
