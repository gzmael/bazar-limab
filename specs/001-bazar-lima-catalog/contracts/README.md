# Contracts: 001-bazar-lima-catalog

Small, implementation-facing contracts for **client cart storage** and **WhatsApp message shape**. Payload REST/GraphQL shapes are generated via `payload-types.ts` and collection configs—not duplicated here.

| File | Purpose |
|------|---------|
| [cart-lines.schema.json](./cart-lines.schema.json) | JSON Schema for `localStorage` cart payload |
| [checkout-draft.schema.json](./checkout-draft.schema.json) | JSON Schema for transient checkout fields (optional `sessionStorage`) |
| [whatsapp-order-message.md](./whatsapp-order-message.md) | Human-readable contract for prefilled order text (FR-009) |
