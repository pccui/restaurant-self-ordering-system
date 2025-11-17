
# Code Quality Principles (Full Version – 32 Principles)

This document captures a complete set of 32 modern engineering principles.
The main project uses a curated subset, but the full reference list is preserved here.

---

## 1. Core Architectural Principles

### 1. SOLID Principles
1. **Single Responsibility Principle**
2. **Open/Closed Principle**
3. **Liskov Substitution Principle**
4. **Interface Segregation Principle**
5. **Dependency Inversion Principle**

### 2. DRY – Don’t Repeat Yourself
Avoid duplication of logic, structures, schemas, or configuration.

### 3. KISS – Keep It Simple, Stupid
Prefer straightforward, readable solutions over “clever” ones.

### 4. YAGNI – You Aren’t Gonna Need It
Only add features when needed.

### 5. Composition Over Inheritance
Prefer building blocks instead of inheritance chains.

---

## 2. Clean Code Principles

### 6. Meaningful Naming
Names must describe purpose, not mechanics.

### 7. Small Functions & Components
Always prefer small, single‑purpose functions/components.

### 8. Single Level of Abstraction per module
No mixing UI + business logic + API calls in one file.

### 9. Explicit over Implicit
Make data flows obvious.

### 10. Minimize Side Effects
Avoid unexpected global state changes.

---

## 3. Frontend-Specific Principles

### 11. Colocation of Logic
React logic stays close to UI unless shared.

### 12. Encapsulated UI State
Use Zustand slices, local component state—avoid global sprawl.

### 13. Pure UI Components
Presentation components must not contain business logic.

### 14. Accessibility First
Proper ARIA, semantics, focus, roles.

### 15. Responsive by Default
Mobile-first, fluid layout.

### 16. Dark Mode Compatibility
Use tokens, not hardcoded colors.

---

## 4. Backend-Specific Principles

### 17. Layered Architecture
Controllers → Services → Repositories → DB.

### 18. DTO Validation
All inputs validated with Zod.

### 19. Consistent Error Handling
Structured API error format.

### 20. Predictable Routing
REST conventions: `/menu`, `/order`, `/sync`.

### 21. Idempotency for Sync
Offline sync endpoints must be idempotent.

---

## 5. Data & Schema Principles

### 22. Schema-First Development
Everything derives from Zod schemas.

### 23. Shared Types Across FE/BE
Single source of truth.

### 24. Clear Migration Strategy
Prisma migrations describe DB evolution.

### 25. Canonical Data Dictionaries
For tastes/ingredients to ensure translation consistency.

---

## 6. Performance Principles

### 26. Avoid Over-Rendering
Use memoization & split components.

### 27. Incremental Loading
Lazy images, route-level loading.

### 28. Efficient Selectors
Zustand selectors to avoid rerenders.

### 29. Minimize Bundle Size
Tree-shaking, component-level imports.

---

## 7. Reliability & Robustness

### 30. Defensive Programming
Validate assumptions explicitly.

### 31. Error Boundary Usage
React error boundaries for graceful fallback.

### 32. Observability Hooks
Logging, analytics points.

---

## Closing Note

This list represents modern, scalable engineering practices.  
The main architecture document contains a curated subset tailored for this project.
