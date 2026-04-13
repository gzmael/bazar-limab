# Feature Specification: Bazar Lima Basilio — Family Catalog & WhatsApp Checkout

**Feature Branch**: `001-bazar-lima-catalog`  
**Created**: 2026-04-13  
**Status**: Draft  
**Input**: User description (summary): Family-run online catalog “Bazar Lima Basilio” with products grouped by room; mobile-first browsing; each product with up to three photos, title, price, condition, short description, optional notes; shopping cart; checkout collects name and contact only to build a prefilled WhatsApp message to the family sales number (no stored buyer profiles); empty-cart checkout state; catalog content maintained by authorized operators.

## Clarifications

### Session 2026-04-13

- Q: Which primary storefront navigation pattern should the spec require for mobile-first browsing and cart access? → A: Persistent bottom navigation (Browse by room + Cart), Option A.
- Q: Should the v1 storefront include global text search or stay room-first only? → A: No global text search in v1; room-first discovery only, Option A.
- Q: How should the Browse experience structure room vs listing screens? → A: Room chooser first (grid or list), then that room’s product listing, Option A.
- Q: Should visitors sort/filter room listings or rely on operator-defined order? → A: No visitor sort; operator-defined display order per room, Option A.
- Q: How should the storefront present loading states for key catalog screens? → A: Skeleton layout placeholders for room chooser, room listing, and product detail, Option A.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse the catalog by room (Priority: P1)

A visitor opens the catalog on a phone, sees a **room chooser** (list or grid of rooms such as Bedroom, Kitchen, Garage, Laundry), picks one, then scans that room’s listing for titles, prices, and primary imagery without friction.

**Why this priority**: Without discoverable listings, no other shopping flow is possible; this is the storefront entry point.

**Independent Test**: Populate sample rooms and products, then verify a user can reach a product list for at least one room and identify price and title from the listing.

**Acceptance Scenarios**:

1. **Given** the catalog has products in multiple rooms, **When** the visitor selects a room (or equivalent filter), **Then** they see only products for that room.
2. **Given** the visitor is on a small screen, **When** they browse listings, **Then** layout remains readable without horizontal scrolling and primary actions remain reachable with one hand.
3. **Given** bottom navigation is visible, **When** the visitor is on a room listing or product detail screen, **Then** they can open the cart in one tap from the bottom bar.
4. **Given** the visitor opens the Browse destination, **When** they have not yet chosen a room, **Then** they see the room chooser (not a mixed multi-room product feed).

---

### User Story 2 - View product details (Priority: P1)

A visitor opens a product and sees one to three photos, title, price, condition, short description, and any optional notes the seller provided (e.g., dimensions, brand, year).

**Why this priority**: Buyers need enough detail to decide before contacting the family; incomplete detail increases abandoned interest.

**Independent Test**: Open any product with minimum and maximum photo counts and verify all required fields render; optional notes appear only when present.

**Acceptance Scenarios**:

1. **Given** a product has one photo, **When** the visitor opens the detail view, **Then** the gallery shows that single image without broken placeholders.
2. **Given** a product has three photos, **When** the visitor opens the detail view, **Then** they can view all three in an obvious, mobile-friendly way.
3. **Given** optional notes are empty, **When** the visitor views the product, **Then** no empty “notes” section is shown.

---

### User Story 3 - Cart and checkout via WhatsApp (Priority: P2)

A visitor adds multiple products with quantities, reviews the cart, enters their name and contact on the checkout step, and confirms. The system opens WhatsApp with a pre-filled message listing each line item (title, quantity, unit price), a computed total, and the buyer’s name and contact. No buyer profile or order history is stored in the catalog system.

**Why this priority**: This completes the commercial intent and hands off to the family’s preferred channel without storing personal data.

**Independent Test**: Add two distinct products with different quantities, complete checkout fields, confirm, and verify the composed message content matches the cart and that the destination is the configured family sales number.

**Acceptance Scenarios**:

1. **Given** the cart has items, **When** the visitor submits checkout with valid name and contact, **Then** a WhatsApp compose flow opens with a message containing buyer name, contact, each product title with quantity and price, and a correct total.
2. **Given** the cart is empty, **When** the visitor opens the checkout view, **Then** they see a clear empty state explaining there is nothing to check out yet (no fake submit).
3. **Given** required checkout fields are missing, **When** the visitor tries to confirm, **Then** they see clear validation feedback and WhatsApp does not open.

---

### User Story 4 - Maintain catalog content (Priority: P2)

An authorized family operator creates and updates rooms, assigns each product to exactly one room, uploads one to three images per product, and edits title, price, condition, description, and optional notes. Changes appear on the public catalog after publishing.

**Why this priority**: The public experience depends on accurate, structured data the family controls.

**Independent Test**: Create a room, create a product linked to it with two photos, publish, then verify it appears under the correct room on the public site with correct fields.

**Acceptance Scenarios**:

1. **Given** an operator is authorized, **When** they create a product with required fields and one to three images, **Then** the product is visible on the storefront according to publish rules.
2. **Given** a product exists, **When** the operator updates price or condition, **Then** the storefront reflects the update without duplicate listings.
3. **Given** multiple products exist in the same room, **When** the operator changes that room’s product display order, **Then** the public room listing reflects the new order without duplicate or missing entries.

---

### Edge Cases

- Product with only one image must not show empty image slots or broken carousel controls.
- Attempting to add more than three images for a product is blocked or clearly prevented in the operator workflow.
- Very long titles or descriptions must not break layout on narrow screens (truncate, wrap, or scroll within controlled regions).
- If WhatsApp cannot be opened (e.g., desktop without app), the user still sees the full message text and a clear explanation to copy or use WhatsApp Web, or an alternate link pattern that works in-browser—without storing buyer data server-side.
- Cart persists only for the browsing session (or equivalent client-side behavior); refreshing the page behavior should be predictable (either persist locally with disclosure or reset—documented in assumptions).
- Duplicate add of the same product increments quantity rather than creating confusing duplicate lines, unless the product is intentionally allowed as separate lines (assume single line per product with quantity).
- Full-screen product image viewing MAY temporarily hide the bottom navigation until the visitor exits that mode, after which the bar MUST be shown again.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST present the catalog brand as “Bazar Lima Basilio” in customer-facing surfaces (header, title, or equivalent).
- **FR-002**: The system MUST organize products under room categories; at minimum the model MUST support Bedroom, Kitchen, Garage, and Laundry, and MUST allow additional room labels defined by operators.
- **FR-003**: Each product MUST belong to exactly one room category.
- **FR-004**: Each product MUST expose a clear title, numeric price in a single agreed currency for the storefront, condition (discrete set such as new / used grades—exact labels operator-configurable or fixed in admin), and a short description.
- **FR-005**: Each product MUST support one to three photos shown on the public detail view.
- **FR-006**: Each product MAY include optional structured or free-text notes for dimensions, brand, and year; when absent, the storefront MUST omit those subsections.
- **FR-007**: Visitors MUST be able to add products to a cart, change quantities, and remove items.
- **FR-008**: The checkout view MUST collect buyer full name and contact (phone or other agreed channel) at send time only; these values MUST NOT be persisted as user records or order history in the catalog system.
- **FR-009**: On successful checkout confirmation, the system MUST open WhatsApp (or web equivalent) targeting the family’s configured sales number with a single message body containing buyer name, contact, each line item with title, quantity, unit price, and a computed total.
- **FR-010**: When the cart is empty, the checkout view MUST show an explicit empty state message and MUST NOT allow sending a WhatsApp order.
- **FR-011**: The storefront MUST be mobile-first: primary flows completable on a small viewport with touch targets suitable for phones.
- **FR-012**: Authorized operators MUST be able to create, update, publish/unpublish, or archive products and room categories, and MUST be able to control each product’s display order within its room’s storefront listing, so the public catalog stays accurate.
- **FR-013**: The public catalog MUST surface loading and error states for the room chooser, room listings, and product detail views without exposing internal technical errors to visitors. While primary content for those views is loading, the storefront MUST show skeleton-style placeholders that mirror the expected layout (not a blank screen); any motion on placeholders MUST respect reduced-motion preferences stated in assumptions.
- **FR-014**: The storefront MUST use clear visual grouping for products, obvious confirmation steps before leaving the site, visible validation when information is missing, and dedicated empty states for cart and checkout so flows are understandable on a phone without training.
- **FR-015**: The storefront MUST provide persistent bottom navigation on customer-facing catalog surfaces with at least two primary destinations: entry to browsing by room (e.g. room list or equivalent) and the cart, such that the cart is reachable in one tap whenever the bar is visible; the bar MAY be hidden only during full-screen media viewing where it would obstruct primary content and MUST return when that mode ends.
- **FR-016**: The public storefront MUST NOT offer global free-text product search in v1; visitors discover products by choosing a room (or equivalent room entry from browse) and scanning that room’s listing.
- **FR-017**: The Browse destination MUST first present a room chooser (list or grid of room categories); only after the visitor selects a room MUST the storefront show that room’s product listing. The chooser MUST not be skipped in normal navigation except via direct deep links to a specific room or product where the implementation still preserves a clear path back to the chooser.
- **FR-018**: On each room’s product listing, the storefront MUST show products in the operator-defined order for that room. The public storefront MUST NOT offer visitor-facing sort, filter, or price/recency controls on listings in v1 (in addition to FR-016’s prohibition on global free-text search).

### Key Entities

- **Room category**: A label representing a part of the house; ordered for display on the storefront room chooser and for browsing; has a stable relationship to many products.
- **Product**: Sellable item with title, price, condition, short description, optional notes (dimensions, brand, year), one-to-three images, exactly one room, publication state, and a storefront list position (or equivalent ordering key) within its room.
- **Cart (session)**: Ephemeral selection of products with quantities for the current visitor; not a stored customer account.
- **Checkout draft (transient)**: Buyer name and contact captured only to build the outbound message; discarded after handoff unless the visitor edits again in the same session.
- **Sales channel configuration**: The family WhatsApp destination and display currency—maintained by operators, not entered by shoppers.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time visitor can locate a product in a chosen room and open its detail page in under 30 seconds on a phone on a typical mobile network in a usability test.
- **SC-002**: At least 90% of participants in a five-person informal test complete add-to-cart and reach the WhatsApp prefilled message without assistance.
- **SC-003**: Checkout with three distinct products produces a WhatsApp message whose line totals and grand total match the cart within one cent of the displayed currency.
- **SC-004**: Empty-cart checkout is recognized immediately: 100% of test sessions see the empty state within one second of opening checkout with no items.
- **SC-005**: Operators can add a new product with images and see it live on the storefront within two minutes of publishing, measured from confirmation in the operator publishing workflow.
- **SC-006**: With bottom navigation visible, a visitor reaches the cart screen from a room listing or product detail in exactly one tap on the cart destination (verified in usability or scripted checks); full-screen image mode is excluded.

## Assumptions

- Currency is Brazilian Real (BRL) for display and message text, consistent with the project’s default locale.
- “Condition” uses a small fixed set of labels agreed by the family (exact wording can match their voice).
- Cart state remains on the shopper’s device only (no server-side cart account); whether selections survive a full page reload is decided during planning and MUST stay consistent with buyer expectations.
- Payment, delivery scheduling, and negotiation after the WhatsApp message are out of scope; the catalog’s job ends at accurate handoff.
- The family provides the WhatsApp business or personal number used in configuration; legal consent for messaging is the family’s responsibility.
- Inventory counts and “out of stock” automation are out of scope unless added later; availability is communicated in description or via WhatsApp.
- Visual richness (motion, delight) is encouraged but MUST respect reduced-motion preferences and MUST NOT harm performance on mobile networks.
- Global free-text product search is out of scope for v1 unless a later revision adds it; v1 discovery remains room-first per FR-016.
- Visitor-facing listing sort and filters (e.g. by price, date, condition) are out of scope for v1; ordering is operator-controlled per FR-018.
