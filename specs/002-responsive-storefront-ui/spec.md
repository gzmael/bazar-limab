# Feature Specification: Responsive Storefront UI

**Feature Branch**: `002-responsive-storefront-ui`  
**Created**: 2026-04-13  
**Status**: Draft  
**Input**: User description: "Improve the user interface. Now we are using responsive layout, no more only mobile-screen layout. At rooms, add a carousel like image 1 on home with each room with also a icon placeholder. Bellow, add some featured products, like image 2 in attachments, not add offer tabs, just name, a description with text-truncated and add to cart button. On product collection add quantity number max. Add more colors and animation site. Show on large screen a top navigation with brand, about, some rooms (with dropdown to show all) and checkout icon with badge items count, some like the image 3 in attachment."

## Clarifications

### Session 2026-04-13

- Q: Which interaction pattern and reference should the product **image gallery** follow? → A: [React Bits **Stack**](https://reactbits.dev/components/stack)—stacked, interactive image presentation as in that component.
- Q: Which visual treatment should **product cards** use? → A: [React Bits **Border Glow**](https://reactbits.dev/components/border-glow)—animated border glow around cards per that pattern.
- Q: How should **numeric amounts** (prices, quantities, totals, badges) behave when values update? → A: **Number Flow** component—digits morph in place when values change (see implementation plan for the exact package import).
- Q: How should storefront styling relate to `src/app/(app)/globals.css` design tokens? → A: The storefront MUST **use all tokens** defined there for **Typography** (`--font-sans`, `--font-serif`, `--font-mono`, `--tracking-normal` and related tracking scale), **text colors** (`--foreground`, `--muted-foreground`, and semantic `*-foreground` pairs), **key semantic colors** (`--background`, `--card`, `--popover`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`, `--ring`, `--chart-1`–`--chart-5`, and sidebar-related tokens), and **shadows** (`--shadow-x`, `--shadow-y`, `--shadow-blur`, `--shadow-spread`, `--shadow-opacity`, `--shadow-color`, and `--shadow-2xs` through `--shadow-2xl`), via `var(...)` / Tailwind theme mapping—no ad-hoc font stacks, hex colors, or raw `box-shadow` values for those categories outside this token set (light and `.dark` variants as applicable).
- Q: Is a standalone **`/about`** page or top-nav About link required? → A: **No**—there is no `/about` route and the large-screen top bar MUST NOT include an About link; navigation focuses on brand, rooms, and cart (see FR-007).
- Q: Should section/UI transition durations be capped (e.g. explicit ms limits)? → A: **No**—keep existing **`motion-safe`** transitions and design-token defaults; no extra duration cap beyond respecting `prefers-reduced-motion` and FR-008.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consistent layout on phone and desktop (Priority: P1)

A shopper opens the storefront on a phone, tablet, or large monitor and sees content that adapts to the screen width—no experience that assumes “mobile only” or leaves large screens feeling empty or awkward.

**Why this priority**: Responsive layout is the foundation for every other UI improvement; without it, subsequent sections cannot meet expectations across devices.

**Independent Test**: Resize the browser or use multiple devices and confirm primary pages remain readable, tappable, and visually balanced without horizontal scrolling for standard content.

**Acceptance Scenarios**:

1. **Given** a viewport at a common phone width, **When** the shopper views the home page, **Then** primary content is usable without unintended overflow or clipped controls.
2. **Given** a viewport at a common desktop width, **When** the shopper views the home page, **Then** content uses the wider space intentionally (not a narrow column with excessive empty margins unless that is the chosen design pattern for the whole site).
3. **Given** the shopper rotates a tablet, **When** the layout updates, **Then** no critical action is hidden or unreachable.

---

### User Story 2 - Browse rooms from a home carousel (Priority: P1)

On the home page, the shopper sees a horizontal “rooms” section styled like a category carousel: each room shows a clear label, a visible icon placeholder (when no custom icon image exists), and a way to move through the list (for example, arrows or equivalent accessible controls). A path exists to see all rooms when applicable.

**Why this priority**: Rooms are a primary way to navigate the catalog; the carousel makes discovery fast on the home page.

**Independent Test**: From the home page, scroll the room strip, activate navigation controls if present, and open a room—without using any other navigation path.

**Acceptance Scenarios**:

1. **Given** multiple published rooms, **When** the shopper views the home page, **Then** they see a horizontal row of room entries with names and icon placeholders where needed.
2. **Given** more rooms than fit on screen, **When** the shopper uses the carousel controls, **Then** additional rooms become visible without leaving the page.
3. **Given** a “view all” (or equivalent) affordance, **When** the shopper selects it, **Then** they reach a view that lists or continues browsing all rooms.

---

### User Story 3 - Featured products on the home page (Priority: P1)

Below the rooms section, the shopper sees a featured products area. Each product card shows the product name, a short description truncated to a single line with ellipsis when long, and an add-to-cart action. Promotional “offer” tabs or similar deal chrome are not part of this section.

**Why this priority**: Featured products drive discovery and conversion directly from the home page.

**Independent Test**: From the home page only, add a featured product to the cart and confirm description truncation behavior on long text.

**Acceptance Scenarios**:

1. **Given** featured products are configured, **When** the shopper views the home page below the rooms section, **Then** they see those products in a card layout with name, truncated one-line description, and add to cart.
2. **Given** a product has a long description, **When** the card renders, **Then** the description shows on one line with clear truncation (ellipsis or equivalent).
3. **Given** the featured section, **When** the shopper inspects the cards, **Then** there are no offer tabs or promotional deal strips as described in scope exclusions.

---

### User Story 4 - Maximum quantity per product (Priority: P2)

A shopper cannot add more than the allowed number of units for a given product. Merchants can set or adjust that maximum in product management so it applies to storefront behavior (for example, add to cart respects the cap).

**Why this priority**: Prevents overselling and sets clear expectations; depends on catalog data being available to the storefront.

**Independent Test**: Set a low max on a test product and verify the storefront blocks quantities above it.

**Acceptance Scenarios**:

1. **Given** a product with a defined maximum purchasable quantity, **When** the shopper attempts to exceed it via add to cart or quantity controls, **Then** the system prevents the excess and communicates the limit clearly.
2. **Given** a product with no maximum specified, **When** the merchant has chosen a sensible default behavior, **Then** behavior matches what is documented in Assumptions (see below).

---

### User Story 5 - Large-screen top navigation (Priority: P2)

On wide screens, the shopper sees a top navigation bar with the brand identity, a subset of room links, a control to open the full list of rooms (for example a dropdown), and a checkout/cart entry point showing a badge with the number of items in the cart. There is **no** `/about` page and no About link in this bar.

**Why this priority**: Desktop and large-tablet users need efficient global navigation and cart visibility.

**Independent Test**: On a wide viewport, complete navigation to a room via the bar and confirm the cart badge updates after adding items.

**Acceptance Scenarios**:

1. **Given** a wide viewport, **When** the shopper views the storefront, **Then** a top bar shows brand, rooms (partial list plus access to all), and cart with badge.
2. **Given** items in the cart, **When** the shopper views the badge, **Then** it reflects the agreed definition of “item count” (see Assumptions).
3. **Given** keyboard or assistive technology users, **When** they operate the rooms menu, **Then** they can reach all rooms without relying on hover-only interactions.

---

### User Story 6 - Richer visual polish (Priority: P3)

The site uses a broader, intentional color palette and subtle motion (for example transitions on hover or section entry) that make the experience feel modern without harming readability or performance.

**Why this priority**: Improves perception and delight after core structure and commerce flows work.

**Independent Test**: Spot-check key pages for consistent color use and motion that respects reduced-motion preferences where applicable.

**Acceptance Scenarios**:

1. **Given** a shopper who prefers reduced motion at the system level, **When** they use the site, **Then** non-essential animations are toned down or disabled in line with that preference.
2. **Given** standard viewing conditions, **When** the shopper navigates between major sections, **Then** transitions feel smooth and do not delay primary tasks beyond a reasonable moment.

---

### User Story 7 - Product gallery, cards, and animated numbers (Priority: P2)

On product detail pages, shoppers browse product images using a **stack-style** gallery (layered images with interactive exploration, consistent with the React Bits Stack reference). Product cards across the storefront (including featured products) use an **animated border glow** treatment consistent with the React Bits Border Glow reference. Whenever prices, line quantities, cart totals, or similar amounts change in response to user actions, the displayed numerals **animate in place** using Number Flow rather than snapping instantly.

**Why this priority**: Directly supports clearer product evaluation, stronger card affordances, and less jarring price/quantity updates—without changing catalog rules.

**Independent Test**: Open a product with multiple images and use the gallery; hover or focus a product card; change quantity or add to cart and observe number transitions—with reduced motion on and off.

**Acceptance Scenarios**:

1. **Given** a product with multiple images, **When** the shopper views the product detail page, **Then** they can explore images through the stack-style gallery interaction.
2. **Given** a product card on home or listing surfaces, **When** the shopper hovers or focuses the card, **Then** the border glow treatment is visible and does not obscure name, price, or primary actions.
3. **Given** a quantity or price that updates after a user action, **When** the new value appears, **Then** numerals animate smoothly; with reduced motion enabled, updates remain clear without mandatory morphing animation.

---

### Edge Cases

- No rooms or only one room: carousel and navigation still behave sensibly (no broken arrows or empty states without explanation).
- No featured products: home page shows an empty or muted state rather than errors.
- Cart empty: badge shows zero or hides per the chosen convention (documented in Assumptions).
- Very long room or brand names: top bar wraps or truncates without breaking layout.
- Max quantity lower than quantity already in cart: user is guided to reduce quantity before checkout.
- Single product image: stack gallery still renders without broken layout or missing controls.
- Rapid price or quantity changes: Number Flow (or static fallback) does not show incorrect intermediate values; screen readers receive the final value.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The storefront MUST provide a responsive layout so primary pages remain usable across common phone, tablet, and desktop widths.
- **FR-002**: The home page MUST include a horizontal rooms carousel showing each room’s name and an icon placeholder when a dedicated icon image is not provided.
- **FR-003**: The rooms carousel MUST provide a discoverable way to see additional rooms when they do not all fit on screen, and a way to access the full set of rooms (for example “view all” and/or a dropdown on large screens).
- **FR-004**: The home page MUST show a featured products section below the rooms section when featured products exist.
- **FR-005**: Each featured product card MUST show product name, a single-line description with truncation when needed, and an add-to-cart action; it MUST NOT include promotional offer tabs or deal strips in that section.
- **FR-006**: Each product in the catalog MUST support a maximum purchasable quantity; storefront purchase flows MUST enforce that maximum.
- **FR-007**: On large viewports, the site MUST show a top navigation bar including brand, partial room links, a control that exposes all rooms, and a cart/checkout entry with a numeric badge tied to cart contents. The bar MUST NOT include an About link and there is no `/about` route.
- **FR-008**: The visual design MUST apply a broader, coherent color palette sitewide and MAY use purposeful animations and transitions that do not block primary tasks.
- **FR-009**: Interactive controls in the rooms navigation MUST be usable without relying solely on hover for essential actions.
- **FR-010**: The product detail image gallery MUST present multiple images in a stacked, interactive arrangement aligned with the [React Bits Stack](https://reactbits.dev/components/stack) pattern (depth, motion, and interaction model as appropriate for touch and pointer).
- **FR-011**: Product cards MUST apply an animated border glow treatment aligned with the [React Bits Border Glow](https://reactbits.dev/components/border-glow) pattern on hover and keyboard focus; essential text and controls MUST remain readable.
- **FR-012**: Monetary amounts, line quantities, cart totals, and cart badge counts that update in place MUST use the Number Flow component so digits animate between values; when the user prefers reduced motion, animations MUST degrade to instant updates or an equivalent accessible pattern without losing the final value.
- **FR-013**: Storefront UI MUST apply the shared design system in `src/app/(app)/globals.css`: use **all** tokens in the **Typography**, **text color**, **key semantic color**, and **shadow** groups (including `@theme inline` mappings that reference those variables) for customer-facing pages and shared storefront chrome. Implementations MUST NOT substitute arbitrary fonts, hard-coded palette values, or one-off shadows for those concerns; chart and sidebar semantic tokens MUST appear wherever charts or sidebar-pattern surfaces are rendered in the storefront (or in shared layout chrome if those surfaces are not yet present, so every token in those groups remains intentionally used).

### Key Entities *(include if feature involves data)*

- **Room**: A grouping for products; has a display name; may have an icon image; appears in home carousel and navigation.
- **Product**: Offered item; has name and description for cards; has a maximum allowed purchase quantity for enforcement.
- **Featured product selection**: The subset of products highlighted on the home page (method of selection is an operational concern—editorial flag, collection, or equivalent—as long as requirements FR-004 and FR-005 are met).
- **Cart**: Holds line items and quantities; drives the count shown on the checkout/cart badge.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On representative phone, tablet, and desktop widths, shoppers can complete viewing the home page (rooms + featured products) and add a featured product to the cart without layout breakage or critical controls off-screen.
- **SC-002**: At least 90% of test participants (or internal QA checklist) can locate rooms from the home carousel and from large-screen navigation within one minute on first visit.
- **SC-003**: For products with a maximum quantity set, attempts to exceed the limit are blocked in 100% of scripted test cases, with a clear message.
- **SC-004**: On a wide screen, the cart badge matches the defined cart count rule in all scripted add/remove scenarios.
- **SC-005**: With system “reduce motion” enabled, non-essential animations are suppressed or minimized in 100% of audited key flows.
- **SC-006**: On product detail pages with two or more images, shoppers can reach every image via the stack gallery without leaving the page, in 100% of scripted multi-image fixtures.
- **SC-007**: When quantity or cart totals change, the on-screen numerals complete their transition to the correct final value in 100% of scripted add/remove scenarios (no stale or ambiguous digits after the interaction finishes).
- **SC-008**: Internal QA (or checklist) confirms that `src/app/(app)/globals.css` tokens for typography, text/semantic colors, and shadows are used across primary storefront routes and chrome with no orphaned tokens in those four groups (every token referenced at least once in customer-facing UI or documented shared chrome).

## Assumptions

- **Featured products**: Products shown in the featured section are chosen through existing or new merchandising controls (for example a “featured” flag or curated list); the spec does not mandate a specific selection algorithm.
- **Cart badge number**: The badge shows the total number of product units in the cart (sum of line quantities), unless the product team later standardizes on “distinct line items”; implementation should follow one rule consistently.
- **Empty cart badge**: When the cart is empty, the badge shows zero or the badge is hidden—either is acceptable if consistent sitewide.
- **Maximum quantity default**: If a product has no explicit maximum set, a reasonable upper bound applies (for example a global default high limit) so the field is never “unbounded” in practice.
- **Icon placeholder**: When no room icon image exists, a neutral placeholder graphic is shown so the carousel still looks intentional.
- **Accessibility**: Carousels and dropdowns have keyboard-accessible alternatives and visible focus states consistent with the rest of the storefront.
- **Number Flow**: The implementation uses the established Number Flow package for React in this project; behavior follows vendor guidance for accessibility and `prefers-reduced-motion`.
- **Component references**: React Bits patterns are references for interaction and visuals; if a pattern is unavailable or incompatible during implementation, planning may substitute an equivalent that satisfies FR-010 and FR-011 with product owner approval.
- **Design tokens**: The canonical token set for typography, text colors, semantic colors, and shadows is `src/app/(app)/globals.css` (including `:root`, `.dark`, and `@theme inline`); storefront work MUST comply with **FR-013** and keep tokens the single source of truth for those categories.
