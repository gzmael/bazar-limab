# Implementation Plan: Bazar Lima Basilio — Family Catalog & WhatsApp Checkout

**Branch**: `001-bazar-lima-catalog` | **Date**: 2026-04-13 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-bazar-lima-catalog/spec.md`  
**Stack input (this run)**: Payload CMS, Next.js (App Router), shadcn/ui, React Bits, SEO via metadata, client-side checkout session storage, PostgreSQL, Dockerfile for CI/CD on Coolify.

## Summary

Deliver a **mobile-first public storefront** (room chooser → room listing → product detail, persistent bottom navigation, skeleton loading) with a **session-local cart** and **WhatsApp prefilled checkout**, backed by **Payload CMS 3.x** collections/globals on **PostgreSQL**, rendered with **Next.js 16** and **shadcn/ui** (plus selective **React Bits** for polish). **SEO** uses the Next.js **Metadata API** and per-route `generateMetadata`. **Buyer data** is not stored as profiles or orders; cart lines live in the browser (**localStorage**). **Operators** manage rooms, product order, media, and sales settings in Payload Admin. **Deployment**: production **Docker** image suitable for **Coolify** (Node 20, pnpm build, Next **standalone** output).

## Technical Context

**Language/Version**: TypeScript 5.4+ on Node.js ≥ 20.9  
**Primary Dependencies**: Next.js 16 (App Router, RSC), Payload CMS 3.82, React 19, shadcn/ui (Radix + Tailwind 4), React Bits (selected components only), `@payloadcms/db-postgres`, Lexical rich text where needed  
**Storage**: PostgreSQL (Payload adapter); public uploads via Payload media; cart/checkout draft client-side (localStorage / transient state—see [research.md](./research.md))  
**Testing**: None per constitution—Biome lint, TypeScript strict, manual mobile + Lighthouse  
**Target Platform**: Web (mobile-first); Linux containers on Coolify  
**Project Type**: Monolithic Next.js + Payload (admin + storefront routes in one app)  
**Performance Goals**: Constitution LCP under 2.5s simulated 4G; page weight under 500 KB compressed; `next/image` + lazy below-fold  
**Constraints**: No horizontal scroll below 480px; touch targets ≥ 44px; pt-BR copy; no server-side buyer profiles (FR-008)  
**Scale/Scope**: Family catalog (moderate SKU count); v1 without global search or visitor sort (FR-016–FR-018)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|--------|
| **I. Mobile-First** | **Pass** | Bottom nav (FR-015), room-first IA, shadcn patterns; layouts tested at ≤375px. |
| **II. Performance Budget** | **Pass** | RSC for listings/detail where possible; skeletons (FR-013) without heavy client bundles; images via `next/image`; React Bits **only** for isolated, tree-shakeable usage; target LCP under 2.5s per constitution. |
| **III. Visual Excellence** | **Pass** | Tailwind 4 + shadcn/ui; React Bits for motion/texture where aligned with `prefers-reduced-motion`. |
| **IV. Simple UX** | **Pass** | Room chooser → listing → detail ≤3 taps from Browse home; cart one tap when bar visible (SC-006); pt-BR. |

**Post-design re-check**: Data model stays in Payload/Postgres; storefront remains server-first reads; cart stays client-local—no new server persistence for shoppers. **No violations** requiring Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/001-bazar-lima-catalog/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md              # from /speckit.tasks (not created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── (app)/                 # Public storefront (routes TBD: /, /browse, /rooms/[slug], /products/[slug], /cart, /checkout)
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   └── (payload)/             # Payload admin + REST/GraphQL routes
│       ├── admin/
│       └── api/
├── collections/               # Payload: Users, Rooms, Products, (+ remove/replace template Posts as needed)
├── globals/                   # Payload global: sales channel (WhatsApp, currency display)
├── components/
│   ├── ui/                    # shadcn primitives
│   ├── storefront/            # catalog-specific (nav, cards, skeletons)
│   └── bits/                  # optional wrappers around React Bits
├── lib/
│   ├── cart/                  # localStorage schema, zod, hooks
│   ├── whatsapp/              # message builder, wa.me URL
│   └── payload/               # typed fetch helpers for storefront
├── payload.config.ts
└── payload-types.ts

migrations/                    # Payload/Postgres migrations (push: false in config today)

Dockerfile                     # NEW: production image for Coolify
```

**Structure Decision**: Single Next.js app already hosts Payload (`(payload)` route group) and a starter `(app)` group. The feature extends `(app)` with storefront routes and adds Payload collections/globals under `src/collections` and `src/globals`. Cart logic lives in `src/lib/cart` (client boundary). **Dockerfile** is added at repo root for Coolify builds.

## Complexity Tracking

> No constitution violations requiring justification.

## Phase 0 & 1 Outputs

| Artifact | Path |
|----------|------|
| Research | [research.md](./research.md) |
| Data model | [data-model.md](./data-model.md) |
| Contracts | [contracts/](./contracts/) |
| Quickstart | [quickstart.md](./quickstart.md) |

## Phase 2

Task breakdown is produced by **`/speckit.tasks`** (`tasks.md`), not by this plan command.
