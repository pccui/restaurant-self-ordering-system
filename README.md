# Restaurant Self-Ordering System (Scaffold)

This repository is a scaffold for the Restaurant Self-Ordering System (Next.js + NestJS + Prisma + IndexedDB offline).

Workspaces:
- frontend (Next.js 15 + TypeScript)
- backend (NestJS + Prisma)
- packages/shared (Zod schemas & sample data)

Use pnpm (pnpm v10+ recommended).

Basic commands (from repo root):
- `pnpm install`
- `pnpm dev` (runs workspace dev scripts)
- `pnpm --filter frontend dev` to run frontend only
- `pnpm --filter backend start:dev` to run backend only (requires Nest wiring)

Notes:
- Replace frontend/public/menu.json with your full menu data, then run seed script to populate DB.
- Set `DATABASE_URL` before running Prisma migrations or seeders.
