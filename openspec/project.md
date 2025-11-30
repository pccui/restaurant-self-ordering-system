# Restaurant Self-Ordering System - Technical Documentation

## Project Context

### Purpose

The Restaurant Self-Ordering System is a full-stack portfolio project demonstrating a modern, multilingual, scalable food ordering experience.

**Its goals:**

- Provide a real-world, production-like architecture example (Next.js + NestJS)
- Support a complete online ordering workflow (menu → basket → order)
- Include an offline demo mode running entirely in the browser (IndexedDB)
- Showcase modern engineering principles, schema-first development, and shared data types
- Demonstrate internationalization (zh / en / de) for both UI and menu data
- Provide a base architecture suitable for real-world restaurants

## Tech Stack

### Development Tools
- pnpm workspace (monorepo)
- Jest for testing
- ESLint and Prettier for code formatting

### Frontend

- Next.js 15 (App Router, RSC aware)
- TypeScript
- ShadCN UI (Radix + TailwindCSS components)
- TailwindCSS (custom tokens, dark mode)
- next-intl (internationalization, zh/en/de)
- Zustand (basket, UI, data mode toggles)
- localforage + IndexedDB (offline store)
- next-pwa (optional PWA support)
- qrcode.react (QR table scanning)

### Backend

- NestJS (modular architecture)
- Prisma ORM
- PostgreSQL
- Zod validation for DTOs
- Socket.io (future realtime updates)
- Docker / docker-compose (optional DB)

### Shared

- Shared schemas in `@restaurant/shared` (Zod-based)
- Shared type definitions for:
  - Menu
  - Translations
  - Order
  - Offline sync payloads
- Shared initialization helpers (`initMenuData()`)


## Project Conventions

### Code Style

- **Files Import Syntax**: ES modules
- **Formatting**: Prettier (2-space indent, trailing commas)
- **Linting**: ESLint for TypeScript + React + NestJS rules
- **Naming Conventions**:
  - Components: `PascalCase.tsx`
  - Hooks: `useSomething.ts`
  - Zustand stores: `something.store.ts`
  - Backend modules: `feature.module.ts`, `feature.service.ts`
  - Shared schemas: `*.schema.ts` and `*.types.ts`
- **Language conventions**:
  - English source code
  - All UI text must come from next-intl translations
  - Menu translations fetched from shared schema

## Architecture Patterns

### 1. Schema-First Architecture

Zod schemas define:

- Database types
- API types
- Frontend UI types

Avoids format drift between FE/BE.

### 2. Composition Over Inheritance

- Components composed through layouts, variants, and providers
- Hooks composed (e.g., `useBasket` + `useMenu`)
- No class-based inheritance

### 3. Layered Architecture

**Frontend:**

`UI → hooks → API provider → online/offline backend`

**Backend (NestJS):**

`Controller → Service → Repository (Prisma)`


### 4. Feature-Based Folder Structure

**Frontend organized by feature:**
- `components/menu`
- `components/basket`
- `components/layout`
- `store/`
- `lib/intl/`
- `lib/api/`
- `app/[locale]/menu/[tableId]`

**Backend modular structure:**
- `modules/menu`
- `modules/order`
- `modules/sync`

### 5. Unified Online and Offline Architecture

- **Online API**: `/api/online/*`
- **Offline**: IndexedDB/localforage
- Both use identical TypeScript types & helpers

## Testing Strategy

### Unit Tests

- Use Vitest (frontend) and Jest (backend)
- Test shared Zod schemas
- Test hooks (`useBasket`, `useMenuProvider`)

### Integration Tests

- Test API endpoints (NestJS testing module)
- Test frontend pages with Playwright (optional)

### Requirements

- No business logic inside React components
- Services and helpers must be testable without framework context

## Git Workflow

### Branching Strategy

- `main`: stable, deployable
- `dev`: integration branch
- **Feature branches**:
  - `feature/menu-api`
  - `feature/offline-mode`
  - `feature/i18n`

### Commit Convention (Conventional Commits)

- `feat`: add offline sync queue
- `fix`: correct menu translation merge
- `chore`: formatting and linting rules
- `refactor`: extract taste dictionary helper
- `docs`: update architecture documentation


### PR Requirements

- Lint passes
- TypeScript passes
- Tests pass
- No unused imports
- No direct string literals for UI text

## Domain Context

### Restaurant Menu Domain

The system supports multi-category Chinese cuisine:

**Sichuan Cuisine**
- Spicy flavors
- Peppercorns (麻/辣)

**Xi'an Cuisine**
- Noodles
- Lamb dishes
- Strong regional flavors

**Menu data includes:**
- Canonical tastes (e.g., spicy, aromatic, sour)
- Canonical ingredients (e.g., beef, chicken, potato)
- Rich translations (zh/en/de)
- Images + optional short video
- Long descriptions with cultural notes

### Ordering Domain

- Each table is identified by a QR code
- Basket items stored locally (Zustand, offline-safe)
- Orders can sync from offline → server once connected

### Offline Domain

- Menu stored in IndexedDB
- Orders stored in pendingOrders
- Background sync pushes pending orders when online

## Important Constraints

### Technical Constraints

- Must run fully offline (demo mode)
- Shared types must remain synchronized
- No backend required for offline mode
- next-intl locale routing must work with dynamic routes

### Business Constraints

- Menu translations must be accurate for three locales
- Offline order sync must be idempotent
- UI must support mobile-first restaurant use-case

### Performance Constraints

- Menu lists must load instantly even offline
- Avoid unnecessary React re-renders (Zustand selectors)

## External Dependencies

### External Services

- PostgreSQL database (local or cloud)
- Optional Render / Supabase hosting
- ShadCN UI dependency (Radix primitives)

### Third-Party Libraries

- localforage (IndexedDB wrapper)
- next-intl (i18n)
- Zustand (state management)
- Prisma (ORM)
- Socket.io (future real-time)

---
