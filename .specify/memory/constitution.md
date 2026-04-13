<!--
  SYNC IMPACT REPORT
  ==================
  Version change: N/A (initial) → 1.0.0
  Modified principles: N/A (first constitution)
  Added sections:
    - Core Principles (4): Mobile-First, Performance Budget,
      Visual Excellence, Simple UX
    - Technology Stack
    - Development Workflow
    - Governance
  Removed sections: N/A
  Templates requiring updates:
    - .specify/templates/plan-template.md ✅ compatible (Constitution
      Check section is dynamic; Testing field marked optional)
    - .specify/templates/spec-template.md ✅ compatible (User Scenarios
      & Testing section uses manual acceptance criteria, no automated
      test dependency)
    - .specify/templates/tasks-template.md ✅ compatible (Tests already
      marked OPTIONAL in template)
  Follow-up TODOs: none
-->

# Bazar Lima B Constitution

## Core Principles

### I. Mobile-First

Every feature MUST be designed and implemented for small screens
(viewport width <= 375px) first, then progressively enhanced for
larger viewports. All interactive elements MUST have a minimum
touch target of 44x44px. Layouts MUST use responsive units
(`rem`, `%`, `vw/vh`, Tailwind responsive prefixes) rather than
fixed pixel widths. Horizontal scrolling MUST NOT occur on any
viewport below 480px.

**Rationale**: The primary audience accesses the catalog on mobile
phones over constrained networks. Desktop is a secondary concern.

### II. Performance Budget

Pages MUST achieve a Largest Contentful Paint (LCP) under 2.5s on
a simulated 4G connection (1.6 Mbps down / 750 Kbps up, 150ms RTT).
Total page weight for any route MUST NOT exceed 500 KB transferred
(compressed). Images MUST be served via `next/image` with
appropriate `sizes`, `width`/`height`, and modern formats (WebP/AVIF).
Client-side JavaScript MUST be minimized — prefer React Server
Components and static rendering. Below-the-fold content MUST be
lazy-loaded.

**Rationale**: Users on 4G connections in Brazil experience variable
throughput; aggressive performance budgets ensure usability under
real-world conditions.

### III. Visual Excellence

The UI MUST follow a cohesive design system built on Tailwind CSS
and shadcn/ui components. Typography scale, spacing tokens, and
color palette MUST be consistent across every page. Animations
MUST be smooth (target 60fps), purposeful, and respect
`prefers-reduced-motion`. Product imagery MUST be high quality
with consistent aspect ratios and art direction for different
breakpoints.

**Rationale**: A polished, professional visual identity builds trust
and makes the catalog inviting for family and customers.

### IV. Simple UX

Navigation MUST allow any user to reach a product detail in 3 taps
or fewer from the home screen. Information architecture MUST be
flat — avoid deep nesting. Forms and interactions MUST provide
immediate visual feedback (loading states, success/error indicators).
Copy and labels MUST be clear, concise, and in pt-BR. Feature scope
MUST be kept minimal — every new interaction MUST justify its
existence against the catalog use case.

**Rationale**: The catalog serves a family audience with varying
technical literacy; simplicity removes friction and drives engagement.

## Technology Stack

- **Framework**: Next.js 16 (App Router, React Server Components)
- **CMS**: Payload CMS 3.82 (PostgreSQL adapter, Lexical editor)
- **Language**: TypeScript 5.4+
- **Styling**: Tailwind CSS 4 + shadcn/ui + tw-animate-css
- **Database**: PostgreSQL
- **Email**: Resend (via @payloadcms/email-resend)
- **Image Processing**: Sharp 0.34
- **Linter/Formatter**: Biome
- **Package Manager**: pnpm
- **Localization**: pt-BR (single locale)
- **Automated Tests**: None — quality is enforced through linting,
  manual device testing, and Lighthouse/performance audits

## Development Workflow

- **No automated test suite**: The project does NOT use unit,
  integration, or end-to-end tests. Quality gates rely on:
  1. Biome linting and formatting (`pnpm lint`, `pnpm format`)
  2. TypeScript strict type-checking
  3. Manual testing on real mobile devices and Chrome DevTools
     device emulation
  4. Lighthouse performance audits against the Performance Budget
     principle
- **Branching**: Feature branches per spec-kit convention
- **Commits**: Small, focused commits with conventional messages
- **Code review**: All changes MUST be reviewed for adherence to
  the four core principles before merging
- **Deployment**: Validated on mobile viewport before promoting
  to production

## Governance

This constitution is the authoritative source of project principles.
All implementation decisions MUST comply with the four core
principles. When a principle conflicts with a deadline or external
requirement, the conflict MUST be documented and an exception
explicitly approved.

**Amendment procedure**:
1. Propose the change with rationale in a constitution PR
2. Review against existing principles for conflicts
3. Update version per semantic versioning (MAJOR for principle
   removal/redefinition, MINOR for additions, PATCH for
   clarifications)
4. Propagate changes to dependent templates via the consistency
   checklist

**Compliance review**: Every feature spec and implementation plan
MUST include a Constitution Check section verifying alignment with
all four principles.

**Version**: 1.0.0 | **Ratified**: 2026-04-13 | **Last Amended**: 2026-04-13
