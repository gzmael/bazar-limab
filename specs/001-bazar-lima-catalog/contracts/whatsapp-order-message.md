# WhatsApp order message contract (FR-009)

Plain-text body assembled client-side and passed to `https://wa.me/<E164>?text=<encoded>` (or platform equivalent). Line order is stable.

## Placeholders

- `{buyerName}` — full name from checkout draft  
- `{buyerContact}` — phone or agreed channel string  
- `{linesBlock}` — one line per cart row (see below)  
- `{totalBrl}` — grand total formatted in pt-BR BRL (matches SC-003 tolerance)

## Line item format

Each line in `{linesBlock}`:

```text
- {quantity}x {title} — {unitPriceBrl} cada
```

(Exact punctuation may be tuned for family voice; totals must remain machine-checkable against cart.)

## Suggested full template

```text
Olá! Pedido pelo catálogo Bazar Lima Basilio:

Nome: {buyerName}
Contato: {buyerContact}

Itens:
{linesBlock}

Total: {totalBrl}
```

## Message length and `wa.me` URL limits

- **UTF-8 body**: Assemble the full template (header, name, contact, lines block, total) as a single string before encoding.
- **Safe length for prefilled URL**: `encodeURIComponent` inflates size; treat **3500 UTF-16 code units** as the maximum length of the **decoded** plain-text body passed into the `text=` query value. If the body exceeds this limit, the client **MUST NOT** silently drop content: show the **full** message in the **desktop/copy fallback** UI and either (a) open `wa.me` with a **short notice line** appended (e.g. that the full list is incomplete in the prefilled text—family should use copied message), or (b) skip opening `wa.me` and instruct the user to paste from copy. Implementations MAY truncate only the `{linesBlock}` portion to fit under the limit while keeping header, buyer lines, and total when possible.
- **Ordering**: Prefer truncating from the **end** of the lines block so earlier line items remain intact.

## Desktop fallback (Edge Cases)

When WhatsApp cannot open, the same string is shown for **copy** with instructions for WhatsApp Web—no server persistence of buyer fields. The copy UI **always** shows the **complete** message (including any truncation notice if the URL path used a shortened body).
