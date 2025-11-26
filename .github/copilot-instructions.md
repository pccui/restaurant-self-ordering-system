# Copilot Instructions: Restaurant Self-Ordering System

## Project Overview
Multilingual (zh/en/de), offline-first restaurant ordering system. **Monorepo** with pnpm workspaces:
- `frontend/` — Next.js 15 (RSC, App Router, next-intl, ShadCN/Tailwind, IndexedDB)
- `backend/` — NestJS + Prisma + PostgreSQL
- `packages/shared/` — Zod schemas (single source of truth)

**Core Architecture**: Shared types guarantee FE/BE consistency. Offline-first via IndexedDB with background sync. Online mode via REST + real-time updates (Socket.io planned).

## Critical Workflows

### Setup & Development
```bash
pnpm install                          # Install all workspace dependencies
pnpm dev                              # Run all workspaces concurrently
pnpm --filter frontend dev            # Frontend only (http://localhost:3000)
pnpm --filter backend start:dev       # Backend only (http://localhost:3001)
```

**Backend requires** `DATABASE_URL` env var. Seed DB: `ts-node backend/src/init/initMenuData.ts` (reads `frontend/public/menu.json`).

### Prisma Commands
```bash
cd backend
npx prisma migrate dev --name <name>  # Create & apply migration
npx prisma generate                    # Regenerate Prisma Client
npx prisma studio                      # DB browser
```

## Project-Specific Conventions

### 1. Schema-First Development
**All data structures** originate in `packages/shared/src/schemas/`. Example:
- `order.ts` → `OrderSchema` (Zod) → used by FE/BE
- Menu schema documented in `docs/architecture.md` (includes `translations: { zh, en, de }`)

**Never** define types directly in FE/BE. Import from `@restaurant/shared` or add to shared schemas.

### 2. Multilingual Data Model
All user-facing content has `translations` object:
```typescript
translations: {
  zh: { name: "...", description: "..." },
  en: { name: "...", description: "..." },
  de: { name: "...", description: "..." }
}
```
- Access via `item.translations[locale]` with fallback: `item.translations[locale] || item.translations.en`
- See `MenuItemCard.tsx` for pattern: `const t = item.translations[locale] || item.translations.en`

### 3. Offline-First Pattern
**All write operations** must support offline mode:
1. Try online API (`/api/online/order`)
2. If fails, queue via `queueOrder()` in IndexedDB
3. Background sync via `syncPendingOrders()` when online

See `frontend/lib/sync/offlineSync.ts` and `frontend/lib/api/orderClient.ts` for reference implementation.

### 4. Backend Architecture
- **Port 3001**, global prefix `/api`
- **Layered**: Controllers → Services → Prisma
- **Validation**: Use Zod schemas from `@restaurant/shared`
- **Prisma models**: Use `Json` fields for multilingual data (not separate columns)

Example service pattern (`menu.service.ts`):
```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

@Injectable()
export class MenuService {
  async getMenu() {
    return await prisma.menuItem.findMany();
  }
}
```

### 5. Frontend Patterns
- **App Router structure**:
  - Routes in `app/` with `route.ts` for API endpoints
  - API handlers: `app/api/online/menu/route.ts`, `app/api/online/order/route.ts`
  - Data/utilities in `lib/`: `lib/api/`, `lib/data/`, `lib/store/`, `lib/sync/`
- **Locale routing**: `app/[locale]/layout.tsx` handles i18n setup
- **State management**: Zustand stores in `lib/store/` (e.g., `orderStore` for cart)
- **Styling**: Tailwind with ShadCN components (`components/ui/`)
- **Client components**: Use `'use client'` for interactivity (see `MenuItemCard.tsx`)
- **Server components**: Default for data fetching (Next.js 15 RSC)

### 6. Component Conventions
- UI primitives in `components/ui/` (Button, Card, Badge, etc.)
- Feature components in `components/menu/`, `components/order/`
- Client-side: import `useLocale` from `next-intl`, `useTranslations` for i18n
- Keep components single-purpose (SOLID principles)

### 7. Data Flow
**Menu Data**:
- Source: `frontend/public/menu.json` → seed → PostgreSQL → API → FE
- Offline: Fetch once, cache in IndexedDB via localforage

**Order Flow**:
- Online: FE → `/api/online/order` → Backend → Prisma
- Offline: FE → IndexedDB queue → background sync → `/api/online/sync`

## Key Files Reference
- `docs/architecture.md` — Comprehensive architecture decisions
- `docs/code-quality-principles.md` — 32 engineering principles (SOLID, DRY, etc.)
- `backend/prisma/schema.prisma` — DB schema (MenuItem, Order models)
- `packages/shared/src/schemas/order.ts` — Order validation schema
- `frontend/lib/sync/offlineSync.ts` — Offline queue implementation
- `backend/src/init/initMenuData.ts` — Seeding script

## Code Quality Requirements
- **TypeScript strict mode** enabled everywhere
- **No `any` types** without explicit justification
- **ESLint + Prettier** enforced via `pnpm format` / `pnpm lint`
- **Single responsibility**: Functions/components do one thing
- **Explicit imports**: No wildcards or side-effect imports
- **Error handling**: Graceful degradation for offline scenarios

## Common Pitfalls
❌ Don't hardcode locale strings—always use `translations[locale]`
❌ Don't mix frontend/backend imports (workspace boundaries)
❌ Don't skip Zod validation on backend endpoints
❌ Don't forget offline fallback for network operations
❌ Don't use relative paths across workspaces—use workspace aliases (`@restaurant/shared`)

## When Adding Features
1. Define schema in `packages/shared/src/schemas/` first
2. Update Prisma schema if DB changes needed
3. Run migration: `npx prisma migrate dev`
4. Implement backend service/controller with validation
5. Add frontend API client with offline support
6. Test both online and offline scenarios
