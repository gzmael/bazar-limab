# UI contract: storefront design tokens (FR-013)

**Spec**: **FR-013**, **SC-008** — canonical source file: `src/app/(app)/globals.css`  
**Curated Hearth (Stitch)**: `designMd` + `namedColors` from Stitch project `14045073527959821628` inform **values** written into that file; components do not embed Stitch hex directly.

## Canonical token groups (must use entirely)

Implementations MUST consume styling through these groups—no parallel hex/RGB fonts or ad-hoc shadows for the same concerns:

| Group | Location in `globals.css` | Examples |
|-------|---------------------------|----------|
| **Typography** | `--font-sans`, `--font-serif`, `--font-mono`; `@theme inline` tracking (`--tracking-tighter` … `--tracking-widest`) | Body, headings, mono |
| **Text / semantic colors** | `:root` / `.dark`: `--foreground`, `--muted-foreground`, `--card`, `--card-foreground`, `--popover*`, `--primary*`, `--secondary*`, `--muted`, `--accent*`, `--destructive*`, `--border`, `--input`, `--ring`, `--chart-1`–`--chart-5`, `--sidebar*` | Surfaces, text, charts, sidebar-pattern chrome |
| **Shadows** | `--shadow-x`, `--shadow-y`, `--shadow-blur`, `--shadow-spread`, `--shadow-opacity`, `--shadow-color`, `--shadow-2xs`–`--shadow-2xl` | Elevation, cards, overlays |

## Stitch mapping (reference only)

Use Stitch **namedColors** and the Curated Hearth rules (editorial calm, tonal surfaces, Family Badge on warm accent, etc.) when **editing** `:root` / `.dark` values. The **names** consumed in React remain Tailwind semantic tokens (`bg-background`, `text-foreground`, `shadow-md`, …) backed by `globals.css`.

| Stitch concept | Typical CSS variable target in this repo |
|----------------|----------------------------------------|
| Surface / parchment | `--background`, `--card` |
| On-surface text | `--foreground`, `--muted-foreground` |
| Primary / forest | `--primary`, `--primary-foreground` |
| Wood / secondary | `--secondary`, `--secondary-foreground` |
| Accent / family chip | `--accent` or dedicated utility after extending theme |
| Outline / ghost | `--border`, `--ring` at low opacity where needed |

## Components (behavior)

| Component | Rules |
|-----------|--------|
| Primary button | Pill where specified; colors from `--primary` / gradients built from primary tokens |
| Product cards | Border Glow (FR-011) using tokens + glow; radii via `--radius` scale |
| Family Badge | Semantic accent/tertiary mapping in `globals.css` + token-backed classes |
| Inputs | `--input`, `--border`, `--ring`; bottom-accent pattern still uses these variables |

## QA (SC-008)

Confirm every variable in the four groups above is **referenced** at least once in customer-facing routes or shared storefront chrome (document any intentional reuse via shared layout).

## Responsiveness

Prototypes are DESKTOP-sized; implementation MUST scale down mobile-first per constitution (breakpoints, `sizes` on images).
