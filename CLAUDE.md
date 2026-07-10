# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Bazar Lima — a mobile-first pt-BR product catalog/storefront built on Next.js 16 (App Router, RSC) + Payload CMS 3.82 with PostgreSQL. Checkout happens via WhatsApp message, not payment processing. Package manager is **pnpm**.

## Commands

- `pnpm dev` — start dev server (http://localhost:3000, admin at /admin)
- `pnpm devsafe` — dev after wiping `.next`
- `pnpm build` / `pnpm start` — production build / serve
- `pnpm lint` / `pnpm lint:fix` — Biome check (scoped to `./src`)
- `pnpm format` — Biome format
- `pnpm generate:types` — regenerate `src/payload-types.ts` after changing collections/globals (never edit that file by hand; Biome excludes it)
- `pnpm payload <cmd>` — Payload CLI (e.g. `pnpm payload migrate`, `migrate:create`)
- `pnpm seed:rooms` — seed baseline rooms (`src/seed/baselineRooms.ts`)

**There is no test suite** (deliberate, per project constitution). Quality gates are Biome, TypeScript strict mode, manual mobile testing, and Lighthouse audits.

### Database / migrations

Requires PostgreSQL (`DATABASE_URL` in `.env`, see `.env.example`). Migrations live in `./migrations`. Schema `push` is only enabled when `PAYLOAD_DB_PUSH=true` and not in production — `migrate:create` needs an interactive TTY, so on Windows use `PAYLOAD_DB_PUSH=true` in dev until a migration can be generated in a TTY environment. Production always runs off committed migrations.

## Architecture

Two Next.js route groups under `src/app`:

- `(app)` — the public storefront: `/` (home), `/browse`, `/rooms/[slug]`, `/products/[slug]`, `/cart`, `/checkout`. Pages are React Server Components fetching via the Local API.
- `(payload)` — auto-generated Payload admin UI and REST/GraphQL API routes. Rarely edited by hand (`importMap.js` is generated).

### Data layer

- Payload config: `src/payload.config.ts` — collections `Users`, `Media`, `Rooms`, `Products` (`src/collections/`), global `SalesChannel` (`src/globals/`). Single locale `pt-BR`. Uploads go to Vercel Blob in production (local `./media` folder otherwise).
- `src/lib/payload/storefront.ts` is the storefront's data-access layer: `getPayload` (Local API, no HTTP), queries filtered by `storeStatus: 'published'`, and `mediaSrc()` which converts Media URLs into same-origin paths so `next/image` uses `images.localPatterns` (see `next.config.mjs`).
- `src/lib/revalidateStorefront.ts` — `revalidatePath` helpers called from collection hooks so admin edits refresh storefront pages. New collections/fields that surface on the storefront should wire into these.

### Cart & checkout flow

Cart is entirely client-side: localStorage-backed (`src/lib/cart/storage.ts`, zod schema in `schema.ts`) with a `CartProvider` context using `useSyncExternalStore` synced across tabs via a `bazar-lima-cart` event. Checkout builds a WhatsApp order message (`src/lib/whatsapp/buildOrderMessage.ts`, truncated to fit wa.me URL limits) using the phone number from the `SalesChannel` global.

### UI

- `src/components/ui/` — shadcn/ui primitives; `src/components/storefront/` — storefront components (header, bottom nav, product cards, skeletons); Tailwind CSS 4 via PostCSS, global styles in `src/app/(app)/globals.css`.
- Path aliases: `@/*` → `./src/*`, `@payload-config` → `./src/payload.config.ts`.

## Project constitution (.specify/memory/constitution.md)

Feature work follows spec-kit specs in `specs/` and MUST comply with four principles:

1. **Mobile-first** — design for ≤375px first; 44x44px minimum touch targets; no horizontal scroll below 480px; responsive units only.
2. **Performance budget** — LCP < 2.5s on simulated 4G; ≤500 KB transferred per route; images via `next/image` with proper `sizes`/dimensions; prefer RSC and static rendering, minimize client JS; lazy-load below the fold.
3. **Visual excellence** — cohesive Tailwind/shadcn design system; 60fps animations that respect `prefers-reduced-motion`.
4. **Simple UX** — product detail reachable in ≤3 taps; flat IA; all copy in **pt-BR**.

## Code style

Biome (`biome.json`): single quotes, semicolons as-needed, trailing commas, 2-space indent, 100-char lines, organized imports. Run `pnpm lint` before committing.
