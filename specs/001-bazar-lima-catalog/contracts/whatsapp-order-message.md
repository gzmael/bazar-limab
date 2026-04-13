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

## Desktop fallback (Edge Cases)

When WhatsApp cannot open, the same string is shown for **copy** with instructions for WhatsApp Web—no server persistence of buyer fields.
