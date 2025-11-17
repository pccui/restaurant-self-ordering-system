
# Restaurant Self‑Ordering System — Full Architecture & Code Quality Specification

## 1. Project Overview
The Restaurant Self‑Ordering System is a multilingual, offline‑capable, spec‑driven portfolio project.
Its purpose is to demonstrate modern full‑stack architecture patterns with the following goals:

- High maintainability
- Strong type‑safety across frontend + backend + shared packages
- Clean domain boundaries
- Offline‑first demo mode
- Real backend mode with PostgreSQL + Prisma
- Modern DX: Next.js 15 + NestJS + pnpm + Turbo‑repo
- Strong multilingual support: zh / en / de

---

## 2. High‑Level Architecture

```
monorepo/
│
├── frontend/ (Next.js 15, RSC, ShadCN, next-intl, Tailwind)
│
├── backend/  (NestJS, Prisma, PostgreSQL, Socket.io)
│
├── shared/   (Zod schemas, TypeScript types)
│
└── docs/
```

### Core Architectural Decisions
- **Monorepo with shared types:** guarantees front/back data consistency.
- **Spec-Driven Development:** Data schemas fully defined in `/shared/schemas`.
- **Multilingual-first:** All menu fields use `translations: { zh, en, de }`.
- **Offline-first:** IndexedDB/localforage storage + background sync.
- **Online mode:** REST API + Socket.io updates.
- **PWA compatible:** Caching, offline behavior, add-to-home-screen.
- **Composable UI:** ShadCN with theme tokens + dark mode.

---

## 3. Shared Schemas (Source of Truth)

### Menu Item Schema (simplified)
```ts
export const MenuItemSchema = z.object({
  id: z.string(),
  category: z.enum(["sichuan", "xian"]),
  image: z.string().url().optional(),
  video: z.string().url().optional(),

  translations: z.object({
    zh: TranslationSchema,
    en: TranslationSchema,
    de: TranslationSchema
  }),

  price: z.number(),

  tastes: z.array(
    z.object({
      zh: z.string(),
      en: z.string(),
      de: z.string()
    })
  ),

  ingredients: z.array(
    z.object({
      zh: z.string(),
      en: z.string(),
      de: z.string()
    })
  )
});
```

### Purpose
- Guarantees identical structure across **DB → Backend API → Frontend UI → Offline DB**.
- Eliminates category mismatch & translation drift.

---

## 4. Backend Architecture

### NestJS Modules
```
backend/src/modules/
  ├── menu/
  ├── order/
  ├── user/
  ├── auth/
  ├── analytics/
  └── websocket/
```

### Menu Flow
1. Client requests `/api/online/menu`.
2. MenuService returns Prisma-mapped data.
3. Data validated with shared schema before sending.

### Offline Sync
- `POST /api/online/orders/sync` accepts queued offline orders.
- Backend returns authoritative order IDs.

---

## 5. Frontend Architecture

### Routing Structure
```
app/
  ├── [locale]/
  │     ├── layout.tsx + NextIntlClientProvider
  │     ├── menu/[tableId]/page.tsx
  │     ├── dashboard/...
  │     └── ...
  ├── api/
  │     └── online/
  │           ├── menu/route.ts (GET /api/online/menu)
  │           └── order/route.ts (POST /api/online/order)
  ├── layout.tsx
  └── page.tsx  (redirect → default locale)

lib/
  ├── api/          (client-side API utilities)
  ├── data/         (static data, menuData.ts)
  ├── store/        (Zustand stores)
  └── sync/         (offline sync logic)
```

### State Management
- **Zustand** for basket, theme, demo toggle, offline status.
- Persistent offline basket using **IndexedDB (localforage)**.

### UI
- ShadCN components extended with:
  - size variants
  - color tokens
  - intent-based variants
- Full dark mode (system + user toggle)
- Responsive Card-based menu list

---

## 6. Multilingual System

### next-intl Setup
- Locale segment: `/[locale]/...`
- Runtime translation loading from:
  ```
  frontend/messages/en.json
  frontend/messages/zh.json
  frontend/messages/de.json
  ```
- Menu translations stored in DB / IndexedDB.

### Why this approach?
- UI strings and menu data translations are separated:
  - **UI** → next-intl messages
  - **Menu** → shared schema `translations`

This prevents mismatch and improves editor productivity.

---

## 7. Offline Mode Architecture

### Storage
- Localforage / IndexedDB with:
  ```
  menu-store
  basket-store
  orders-pending-store
  ```

### Sync cycle
1. User makes orders offline.
2. Orders saved in `orders-pending-store`.
3. Background task tries to POST to server.
4. On success, offline item replaced with server-issued ID.

---

## 8. Code Quality Principles

### 8.1 SOLID
- **S**: MenuService / OrderService extracted and isolated.
- **O**: Components reusable with variants.
- **L**: Translation provider strictly matches next-intl interface.
- **I**: Zod schemas per domain segment.
- **D**: Components depend on interfaces, not data structures.

### 8.2 DRY (Don't Repeat Yourself)
- Shared validation schemas
- Shared translations
- Shared UI primitives
- One source of truth for theme tokens

### 8.3 KISS (Keep It Simple, Stupid)
- Minimal state
- Minimal API surface
- Clear separation: Online API vs Offline Demo

### 8.4 Composition Over Inheritance
- UI built from composable layout wrappers
- Hooks composed instead of building large class utilities

### 8.5 Separation of Concerns
- API layer separated from UI
- Data fetching abstracted (online/offline)
- No business logic inside components

### 8.6 Single Source of Truth
- Shared schema → single definitive data format
- Menu canonical taste/ingredient lists

### 8.7 Predictability & Explicitness
- Explicit imports
- Explicit variant tokens
- Explicit Zustand store slices

### 8.8 Type Safety
- All data models defined in `/shared`
- Backend validates using Zod
- Frontend consumes the same types

### 8.9 Code Style & Formatting
- ESLint + Prettier enforced
- `"strict": true` in tsconfig
- Import sorting enabled
- Tailwind class sorting (prettier-plugin-tailwindcss)

---

## 9. Theme & UI Architecture

### Tailwind Tokens
```
--color-primary
--color-accent
--color-muted
--color-destructive
--color-border
```

### ShadCN Component Variants
- `Button`
  - variants: `default`, `outline`, `ghost`, `destructive`
  - sizes: `sm`, `md`, `lg`, `xl`

### Dark Mode
- `darkMode: "class"`
- User toggle stored via Zustand
- System preference respected

---

## 10. Testing Strategy
- **Unit Tests:** Zod schemas, formatters, hooks
- **Integration Tests:** Next.js API route handlers
- **E2E Tests:** Playwright (menu flow + offline ordering)
- **Mocking:** MSW for API fallback

---

## 11. Repository Standards

### Commit conventions
Conventional Commits:
```
feat: add offline sync queue
fix: menu translations not loading
chore: update prisma client
refactor: extract order calculator
```

### Folder constraints
- Frontend components must not import backend code.
- Backend must not import frontend modules.
- Shared layer contains only type-safe, environment-agnostic logic.

---

## 12. Future Roadmap
- Payment integration (Stripe / PayPal / Adyen)
- Admin Dashboard v2
- Table-side QR code printer
- Real chef’s screen for real-time order status

---

## End of Document
