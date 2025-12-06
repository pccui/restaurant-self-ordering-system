# Authentication Architecture & Migration

## Overview
This document outlines the authentication strategy for the Restaurant Self-Ordering System, specifically the migration from cookie-based authentication to Bearer Token authentication to support cross-origin deployments (e.g., Vercel Frontend + Render Backend).

## Authentication Strategy: Bearer Token
We use **Bearer Tokens** (store in `Authorization` header) for all authenticated requests. This ensures compatibility across different domains and proxies.

### Architecture
1.  **Login**:
    *   Client sends POST `/api/auth/login`.
    *   Backend validates credentials.
    *   Backend returns JSON: `{ user: User, accessToken: string }`.
2.  **Storage**:
    *   Frontend stores `accessToken` in **LocalStorage** (persisted via Zustand `authStore`).
3.  **Request Authorization**:
    *   Frontend API client retrieves token from store.
    *   Adds header: `Authorization: Bearer <token>`.
4.  **Backend Validation**:
    *   NestJS `JwtStrategy` extracts token from the `Authorization` header.
    *   Validates signature and expiration.
    *   Populates `req.user`.

## Migration from Cookies
Initially, the system used `HttpOnly` cookies. This was replaced because:
1.  **Cross-Origin Issues**: Browsers block third-party cookies by default or require complex `SameSite=None; Secure` configuration which can be flaky across different hosting providers (Vercel vs Render).
2.  **Proxy Limitations**: The Next.js API route (`/api/order`) acts as a proxy. Forwarding cookies securely through a proxy is more error-prone than explicit header forwarding.

### Changes Implemented
*   **Backend**: `AUTH_CONTROLLER` updated to return token in body. `JWT_STRATEGY` updated to check Bearer header.
*   **Frontend Store**: Added `accessToken` to `AuthState`.
*   **API Client**: `auth.ts` and `orderClient.ts` updated to inject the token.
*   **Next.js Proxy**: `app/api/order/route.ts` updated to explicitly forward the `Authorization` header.
*   **Audit Proxy**: `app/api/admin/audit/route.ts` and `entity/route.ts` created/updated to forward `Authorization` header.

## Verification Checklist
To verify the authentication flow:

1.  **Login**: Check that the `login` API response contains `accessToken`.
2.  **Storage**: Verify `auth-storage` in LocalStorage contains the token.
3.  **Network**: Verify that requests to protected endpoints (e.g., `/api/order`) include the `Authorization` header.
