# Quickstart: 001-bazar-lima-catalog

Local development and Coolify-oriented deployment notes.

## Prerequisites

- Node.js ≥ 20.9  
- pnpm  
- PostgreSQL (local or Docker) reachable via `DATABASE_URL`  
- Optional: Resend API key for Payload email adapter

## Environment variables

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Postgres connection string for Payload |
| `PAYLOAD_SECRET` | Payload secret |
| `RESEND_API_KEY` | Email (existing adapter) |
| `NEXT_PUBLIC_SERVER_URL` | Public site URL for metadata/canonical (set per env) |

Add any future `PAYLOAD_PUBLIC_SERVER_URL` / Coolify-assigned host as needed for absolute URLs in OG tags.

## Local dev

```bash
pnpm install
pnpm dev
```

- Storefront: Next `(app)` routes (as implemented)  
- Admin: `/admin` (Payload)

## Database

Payload is configured with `push: false` and `migrationDir: './migrations'`. After schema changes:

```bash
pnpm payload migrate:create
pnpm payload migrate
```

(Exact Payload CLI workflow per project conventions.)

## Docker / Coolify

1. Enable **`output: 'standalone'`** in `next.config.mjs` before image build.  
2. Build with repo-root `Dockerfile` (to be added): multi-stage `pnpm install` → `pnpm build` → copy `standalone` + static assets.  
3. Expose **3000**; set Coolify env vars to match production Postgres and secrets.  
4. Run `node server.js` from the standalone output directory.

## SEO smoke check

- View source or DevTools: `meta`, `og:*`, `canonical` on home, room, and product routes.  
- Validate pt-BR titles do not leak draft/unpublished labels.

## Cart disclosure (UX)

Add short pt-BR copy wherever the cart is introduced: cart persists **on this device** (localStorage), not as an account.
