## Context

The Merchant Center's `public-page-layout` component provides a centered layout for unauthenticated pages (login, registration, password reset). It's being migrated to Nimbus as part of FEC-428. The existing Nimbus pattern system already has `actions` and `dialogs` categories; this adds a `pages` category.

PublicPageLayout is a Tier 1 (simple) pattern — a single component with a flat-props API that composes existing primitives. It has no recipe (no Chakra styling variants), no compound sub-components, and no React Aria integration beyond semantic HTML.

## Goals / Non-Goals

**Goals:**

- Provide a drop-in replacement for MC's `public-page-layout`
- Flat-props API covering the common case: logo, welcome message, content, legal footer
- Centered, vertically stacked layout using design tokens for spacing and max-widths
- Support normal (narrow form) and wide content widths
- i18n defaults for the welcome heading and landmark aria-label
- Full file set matching existing pattern conventions (stories, docs, consumer tests)

**Non-Goals:**

- No responsive breakpoint logic — the layout is always centered and stacks vertically
- No Chakra recipe — styling is purely via inline token props on Flex/Stack/Box
- No compound component API — the flat-props surface covers all current use cases
- No authentication logic or route protection — this is a layout shell only
- No background image or color customization beyond what Chakra style props provide via escape hatch

## Decisions

### 1. Flat-props pattern (not compound)

The layout has a fixed structure (logo → heading → content → footer). There's no need for consumers to reorder or omit structural sections beyond what conditional rendering of optional props provides. A flat-props API (`logo`, `welcomeMessage`, `legalMessage`, `contentWidth`, `children`) keeps the API surface small and the usage simple.

**Alternative considered:** Compound pattern (`PublicPageLayout.Logo`, `.Content`, `.Footer`). Rejected because the layout structure is fixed and the flat API already covers all known use cases. Consumers needing a different structure can compose Flex/Stack directly (escape hatch).

### 2. No Chakra recipe

The component only needs a centered Flex column with token-based spacing and max-widths. There are no visual variants beyond `contentWidth` (which maps to a max-width value). Style props on Flex/Stack are sufficient. Adding a recipe would be overhead with no benefit.

### 3. Semantic HTML via landmark

The outer container uses `role="main"` with an `aria-label` (i18n default: "Public page") so assistive technology users can identify the page landmark. The welcome message renders as a Heading for document outline.

### 4. contentWidth as a union type

`contentWidth: "normal" | "wide"` maps to max-width tokens internally. "normal" targets form-width content (~400px), "wide" targets wider content (~600px). This avoids exposing raw pixel values while covering the two known use cases.

### 5. i18n messages

Two messages: `welcomeMessage` (default heading text, e.g., "Welcome") and `ariaLabel` (landmark label, e.g., "Public page"). Components consuming PublicPageLayout can override both via props, but sensible defaults reduce boilerplate.

## Risks / Trade-offs

- **[Fixed layout structure]** → Consumers who need a radically different layout must use the escape hatch (compose Flex/Stack manually). This is acceptable because the pattern targets a well-defined, narrow use case.
- **[No background customization]** → The pattern renders no background styling. Consumers needing branded backgrounds must wrap PublicPageLayout in their own container. This keeps the pattern focused on structure rather than visual branding.
- **[New `pages` category]** → Creates a new pattern category directory. This is a one-time cost that enables future page-level patterns (e.g., DefaultPage, DetailPage if migrated).
