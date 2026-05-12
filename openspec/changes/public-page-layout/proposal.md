## Why

The Merchant Center uses a `public-page-layout` component for public-facing pages (login, registration, password reset). As part of the Application-Components Migration to Nimbus (FEC-428), this layout needs a Nimbus-native replacement so consuming teams can migrate off the legacy MC component. Providing it as a pattern in Nimbus ensures consistent structure, accessibility, and theming across all public pages.

## What Changes

- Add a new `PublicPageLayout` pattern at `packages/nimbus/src/patterns/pages/public-page-layout/`
- Introduce a flat-props API: `logo`, `welcomeMessage`, `legalMessage`, `contentWidth`, `children`
- Compose internally from existing Nimbus primitives (Flex, Stack, Heading, Text)
- Create the `pages` pattern category with barrel exports
- Provide full file set: `.tsx`, `.types.ts`, `.stories.tsx`, `.dev.mdx`, `.docs.spec.tsx`, `.i18n.ts`, `.mdx`

## Capabilities

### New Capabilities

- `public-page-layout`: A pre-built, centered page layout pattern for public-facing pages with slots for brand logo, welcome heading, main content, and legal footer. Supports normal and wide content widths.

### Modified Capabilities

(none)

## Impact

- **New files**: ~10 files in `packages/nimbus/src/patterns/pages/public-page-layout/`
- **Modified files**: `packages/nimbus/src/patterns/index.ts` (add pages export)
- **Public API**: New `PublicPageLayout` export from `@commercetools/nimbus`
- **Dependencies**: Only existing Nimbus primitives (Flex, Stack, Heading, Text) — no new dependencies
- **i18n**: New messages for default welcome heading text and accessible landmark label
