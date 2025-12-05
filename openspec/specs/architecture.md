
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
1. Client requests `/api/menu`.
2. MenuService returns Prisma-mapped data.
3. Data validated with shared schema before sending.

### Order Flow
1. Client creates order locally with `placedAt: 0` (cart state).
2. Client places order → `POST /api/order` with `placedAt: Date.now()`.
3. Order enters 5-minute edit window (status: `pending`).
4. Within edit window: client can remove items, always can add items.
5. After 5 minutes: order auto-confirms → `status: confirmed`.
6. Staff progresses: `confirmed` → `preparing` → `completed` → `paid`.

### Order Edit Window Logic
- **Duration**: 5 minutes from `placedAt` timestamp.
- **Remove items**: Only allowed within edit window AND status is `pending`.
- **Add items**: Always allowed regardless of edit window or status.
- **Auto-confirm**: Frontend timer calls `POST /api/order/:id/confirm` when window expires.
- **Audit log**: Auto-confirm logged with `user: system, reason: auto-confirmed`.

### Offline Sync
- `POST /api/order` accepts orders (replaces old `/api/online/orders/sync`).
- Background sync via `syncPendingOrdersToServer()`.
- Backend returns authoritative order IDs.

### 4.4 Order Status Lifecycle
```
┌─────────────┐     place order      ┌─────────────┐
│   (cart)    │ ──────────────────▶  │   pending   │
│ placedAt: 0 │                      │             │
└─────────────┘                      └──────┬──────┘
                                            │
                           5-min timer OR   │
                           staff action     ▼
                                     ┌─────────────┐
                                     │  confirmed  │
                                     └──────┬──────┘
                                            │
                              kitchen starts │
                                            ▼
                                     ┌─────────────┐
                                     │  preparing  │
                                     └──────┬──────┘
                                            │
                              food ready    │
                                            ▼
                                     ┌─────────────┐
                                     │  completed  │
                                     └──────┬──────┘
                                            │
                              payment       │
                                            ▼
                                     ┌─────────────┐
                                     │    paid     │
                                     └─────────────┘
```

**Status Actions by Role:**
| Status | Kitchen | Waiter | Admin |
|--------|---------|--------|-------|
| pending → confirmed | ✅ | ❌ | ✅ |
| confirmed → preparing | ✅ | ❌ | ✅ |
| preparing → completed | ✅ | ❌ | ✅ |
| completed → paid | ❌ | ✅ | ✅ |
| Delete order | ❌ | ❌ | ✅ (not paid) |

### 4.5 Security & CORS
- **CORS Configuration**:
  - Implemented via NestJS `app.enableCors()`.
  - Development: Allows all origins.
  - Production: Restricts to `FRONTEND_URL`.
  - Allowed methods: GET, POST, PUT, DELETE, PATCH, OPTIONS.
  - Credentials allowed.

  - Allowed methods: GET, POST, PUT, DELETE, PATCH, OPTIONS.
  - Credentials allowed.

### 4.6 Common Backend Patterns & Troubleshooting

#### Circular Dependencies (Injection Issues)
**Problem**: In complex modules (e.g., Order depends on Audit, Audit depends on User, User depends on Order), NestJS may fail to resolve dependencies automatically.
**Symptom**: `TypeError: Cannot read properties of undefined` when accessing an injected service (e.g., `this.orderService`).
**Solution**: Use explicit `@Inject()` token resolution in the constructor.

```typescript
// ❌ Implicit injection (fails in circular deps)
constructor(private readonly orderService: OrderService) {}

// ✅ Explicit injection (works)
import { Inject } from '@nestjs/common';

constructor(
  @Inject(OrderService) private readonly orderService: OrderService
) {}
```
**When to use**: Only when standard injection fails due to cyclic module imports.

---

## 5. Frontend Architecture

### Routing Structure
```
app/
  ├── [locale]/
  │     ├── layout.tsx + NextIntlClientProvider
  │     ├── menu/page.tsx              (browse-only, no cart)
  │     ├── [tableId]/menu/page.tsx    (table ordering, server mode)
  │     ├── local/[tableId]/menu/...   (table ordering, local mode)
  │     ├── dashboard/...              (staff order management)
  │     ├── login/page.tsx             (staff authentication)
  │     └── ...
  ├── api/
  │     ├── menu/route.ts              (GET /api/menu)
  │     ├── order/route.ts             (POST /api/order, GET /api/order)
  │     ├── order/[id]/route.ts        (GET /api/order/:id)
  │     ├── order/[id]/status/route.ts (PATCH /api/order/:id/status)
  │     ├── order/[id]/items/route.ts  (PATCH /api/order/:id/items)
  │     ├── order/[id]/confirm/route.ts (POST /api/order/:id/confirm)
  │     └── order/table/[tableId]/route.ts (GET order by table)
  ├── layout.tsx
  └── page.tsx  (redirect → default locale)

lib/
  ├── api/          (client-side API utilities)
  ├── data/         (static data, menuData.ts)
  ├── hooks/        (useRouteMode, useOrderSync, useOrderTimer, etc.)
  ├── store/        (Zustand stores: orderStore, menuStore, authStore)
  └── sync/         (offline sync logic: localSync.ts)

hooks/
  ├── useOrderTimer.ts   (5-min edit window countdown, auto-confirm)
  ├── useOrderSync.ts    (poll server for status updates)
  └── useRequireAuth.ts  (dashboard authentication guard)
```

### Route Modes
| Route | Purpose | Cart Enabled |
|-------|---------|--------------|
| `/en/menu` | Browse menu only | ❌ No |
| `/en/T01/menu` | Table ordering (server mode) | ✅ Yes |
| `/en/local/T01/menu` | Table ordering (local mode) | ✅ Yes |
| `/en/dashboard` | Staff dashboard | N/A |
| `/en/login` | Staff login | N/A |

### useRouteMode Hook
Determines data mode from URL path (single source of truth):
- `mode`: 'local' or 'server'
- `isBrowseOnly`: true when on `/[locale]/menu` without tableId
- `canOrder`: true when user has a valid table assignment
- `showModeToggle`: only on table-specific routes

### Order Timer Hook (useOrderTimer)
Tracks 5-minute edit window for placed orders:
- `timeRemaining`: milliseconds until auto-confirm
- `minutes`, `seconds`: formatted countdown display
- `isEditable`: true when within edit window AND order placed
- `isExpired`: true when timer has elapsed
- Auto-calls `confirmOrder()` when timer expires

### Order Sync Hook (useOrderSync)
Polls server for order status updates (3-minute interval):
- Only active in server mode with placed order
- Updates local state when server status changes
- Handles status transitions (confirmed, paid, etc.)
- Silent 404 handling for orders not yet synced

### State Management
- **Zustand** for basket, theme, demo toggle, offline status.
- Persistent offline basket using **IndexedDB (localforage)**.

#### Zustand Subscription Best Practices
When subscribing to Zustand store, follow these rules for proper reactivity:

```tsx
// ✅ DO: Subscribe to state values
const activeOrder = useOrderStore((s) => s.activeOrder)
const hasUnsavedChanges = useOrderStore((s) => s.hasUnsavedChanges)

// ✅ DO: Compute derived values in component
const orderPlaced = activeOrder !== null && activeOrder.placedAt > 0

// ❌ DON'T: Subscribe to method references
const isOrderPlaced = useOrderStore((s) => s.isOrderPlaced) // function ref
const result = isOrderPlaced() // Won't re-render when state changes!
```

**Why?** Function references never change, so React won't re-render. Always subscribe to the actual state values that change.

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
  - variants: `default`, `outline`, `ghost`, `destructive`, `danger`, `primary`
  - sizes: `sm`, `md`, `lg`, `xl`

### Icons (lucide-react)
All icons use lucide-react for consistency:
- **Order Status**: `Clock` (pending), `Pencil` (editable), `Check` (confirmed), `ChefHat` (preparing), `CheckCircle` (completed), `CreditCard` (paid)
- **Navigation**: `ClipboardList` (orders), `Users` (users), `ScrollText` (audit), `UtensilsCrossed` (menu)
- **Actions**: `Menu` (hamburger), `LogOut`, `X` (close), `Gamepad2` (demo mode)

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
