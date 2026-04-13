# Research & Decisions: 001-bazar-lima-catalog

**Date**: 2026-04-13  
**Spec**: [spec.md](./spec.md)

## 1. Stack alignment (Next.js + Payload + PostgreSQL)

**Decision**: Keep the existing **monolithic** Next.js 16 + Payload 3.82 app with **`@payloadcms/db-postgres`** as the system of record for catalog content and operator auth.  
**Rationale**: Matches constitution, user direction, and current `payload.config.ts`; Postgres suits relational rooms ↔ products and ordering.  
**Alternatives considered**: Separate storefront API service (rejected: unnecessary complexity for family SKU scale); MongoDB (rejected: user asked PostgreSQL; constitution lists Postgres).

## 2. Cart & checkout session (cookie vs session vs localStorage)

**Decision**:

- **Cart lines** (product id, quantity, optional denormalized title/price for WhatsApp text): persisted in **`localStorage`** under a versioned key (e.g. `bazar-lima.cart.v1`), validated with **Zod** on read/write.
- **Checkout draft** (buyer name + contact for the current attempt): held in **React state** while on `/checkout`; optional **`sessionStorage`** mirror **only** to survive accidental refresh **within the same browser tab**, cleared after successful handoff or explicit abandon—**never** written to Postgres as a profile or order (FR-008).
- **HTTP cookies**: **Not required** for v1 cart; avoids size limits and CSRF surface for non-essential state. If Coolify or middleware later needs SSR awareness of cart, re-evaluate a signed, minimal cookie—out of scope for initial implementation.

**Rationale**: Spec assumes device-local cart and requires predictable reload behavior; localStorage gives **persistence across reloads** with a simple **in-UI disclosure** (footer or cart sheet) that the cart is stored on the device.  
**Alternatives considered**: Cookies for cart (rejected for v1: size limits, complexity); server session cart (rejected: contradicts “no server-side cart account” intent).

## 3. shadcn/ui + React Bits

**Decision**: Use **shadcn/ui** as the primary component layer (buttons, sheet/dialog, form controls, skeleton). Use **React Bits** sparingly for **marketing-style or hero micro-interactions** (e.g. subtle backgrounds or text effects) where bundle impact is isolated and `prefers-reduced-motion` is honored.  
**Rationale**: Constitution emphasizes performance and cohesive design; uncontrolled React Bits usage can bloat client JS.  
**Alternatives considered**: React Bits everywhere (rejected: performance risk); Framer Motion only (rejected: user asked React Bits).

## 4. SEO & metadata

**Decision**: Use Next.js **`metadata` / `generateMetadata`** on layout and dynamic segments (`/rooms/[slug]`, `/products/[slug]`), with **Open Graph** and **canonical URLs**, **pt-BR** `lang`, and `robots` appropriate for a public catalog. Product/room pages get unique titles and descriptions from Payload fields.  
**Rationale**: First-class App Router pattern; satisfies “SEO with metadata” without extra crawlers.  
**Alternatives considered**: Client-only `next/head` (rejected: worse for SEO with RSC).

## 5. Docker & Coolify

**Decision**: Add a **multi-stage Dockerfile**: deps → `pnpm build` with `NEXT_TELEMETRY_DISABLED=1`, enable Next **`output: 'standalone'`** in config for a smaller runtime image, run **`node server.js`** from `.next/standalone`. Document **port 3000** and **environment variables** for Coolify (see [quickstart.md](./quickstart.md)).  
**Rationale**: Coolify expects containerized workloads; standalone is the standard Next.js container pattern.  
**Alternatives considered**: `next start` without standalone (rejected: larger images, slower deploys).

## 6. Payload content modeling (high level)

**Decision**: **Rooms** and **Products** as collections; **Sales settings** (WhatsApp E.164 or display number, default currency code for formatting) as **Payload Global** or singleton collection; **Users** remain admin-only. Product **gallery** 1–3 images via relationship/array + upload validation hook. **Sort order** per room via numeric `sort` or explicit `order` field.  
**Rationale**: Maps directly to FR-002–FR-006, FR-012, FR-018 and Key Entities.  
**Alternatives considered**: Single “Product” with JSON rooms (rejected: weak querying and ordering).

## 7. Storefront data access

**Decision**: Prefer **server-side** fetching in RSC using Payload **Local API** (`getPayload` / direct DB) or REST from the same origin for public reads; **revalidate** via `revalidateTag`/`revalidatePath` on publish hooks.  
**Rationale**: Keeps TTFB reasonable and avoids exposing admin APIs; aligns with performance constitution.  
**Alternatives considered**: Client-only fetch to public REST (acceptable fallback for progressive enhancement, not primary).
