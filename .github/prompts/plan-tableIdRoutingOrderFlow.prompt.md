# Plan: Table ID Routing & Order Flow Optimization

**TL;DR**: Add `[tableId]` dynamic route segment to URL, refactor order flow to 5-min editable window with server status sync, remove order history in favor of persistent order display.

## Design Decisions

- **QR code generation**: ✅ Add `/api/admin/tables/:id/qr` endpoint
- **Order session**: ✅ Single order until paid, then reset
- **Real-time updates**: ✅ Start with polling (30s), add Socket.io later

## Steps

### 1. Add `[tableId]` route segment
- Restructure `app/[locale]/menu/` → `app/[locale]/[tableId]/menu/`
- Extract `tableId` param in layout, pass to orderStore via context/props
- Update `orderStore.ts` to store `tableId` in state

### 2. Extend backend order model for status lifecycle
- Add `updatedAt` to `schema.prisma`
- Define status enum: `pending` → `confirmed` → `preparing` → `completed` → `paid`
- Add `lockedAt: DateTime?` field for server-side lock timing

### 3. Add backend order endpoints
- GET `/api/online/order/:id` - fetch order status
- PATCH `/api/online/order/:id` - update items (only if not locked)
- PATCH `/api/online/order/:id/status` - update status (for payment)
- Implement 5-min lock check server-side in `order.service.ts`

### 4. Refactor frontend order flow
- Change timer from 10min → 5min in `orderStore.ts`
- Remove `orderHistory` array, keep only `activeOrder`
- Add `syncOrderFromServer()` to poll/fetch order status
- Enable cart item edit/remove during 5-min window

### 5. Update OrderPanel UI
- Remove order history accordion from `OrderPanel.tsx`
- Show cart + placed order always visible
- During 5-min window: allow item qty change, item removal
- After lock: read-only display with status badge

### 6. Add order status polling
- Create `useOrderSync.ts` hook - polls every 30s
- Update local `activeOrder.status` from server response
- Handle status transitions: `confirmed` → `preparing` → `completed`

### 7. Add QR code generation endpoint
- Create `tables` module in backend
- GET `/api/admin/tables/:id/qr` - returns QR code image/data URL
- QR encodes: `{baseUrl}/{locale}/{tableId}/menu`

### 8. Implement order session reset
- After `paid` status: clear `activeOrder`, allow new order
- Add `resetOrder()` action to orderStore
- Frontend detects `paid` status → shows "Thank you" → auto-reset after delay