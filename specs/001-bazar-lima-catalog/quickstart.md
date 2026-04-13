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
| `PAYLOAD_DB_PUSH` | Set to `true` **only in local dev** to sync Postgres schema without interactive `migrate:create` (see Database). Never in production. |

Add any future `PAYLOAD_PUBLIC_SERVER_URL` / Coolify-assigned host as needed for absolute URLs in OG tags.

## Local dev

```bash
pnpm install
pnpm dev
```

- Storefront: Next `(app)` routes (as implemented)  
- Admin: `/admin` (Payload)

## Database

`migrationDir` is `./migrations`. **Production / CI**: keep schema changes as migrations (`pnpm payload migrate:create` then `pnpm payload migrate`). `migrate:create` asks interactive questions; on **Windows** if stdin is not a TTY, run it once from **WSL**, **macOS/Linux**, or a full interactive terminal and commit the generated files.

**Local dev shortcut** (until a migration is committed): with Postgres running,

```bash
# Linux/macOS
PAYLOAD_DB_PUSH=true pnpm dev
```

```powershell
# Windows PowerShell
$env:PAYLOAD_DB_PUSH="true"; pnpm dev
```

Stop the dev server, unset `PAYLOAD_DB_PUSH`, then prefer migrations for anything you deploy.

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
