## Why

Nimbus has no breadcrumb navigation component. Applications with nested hierarchies
(catalog → category → product, settings sections, multi-step flows) need an accessible,
consistent way to show the path to the current page and let users step back up it. Adding
a first-class `Breadcrumbs` component fills that gap with WCAG 2.1 AA navigation semantics
and the design system's token-based styling.

## What Changes

- Add a `Breadcrumbs` compound component built on React Aria Components'
  `Breadcrumbs`/`Breadcrumb` primitives (per Nimbus's "use the RAC primitive when one
  exists" architecture decision), styled with a Chakra recipe and Nimbus tokens.
- Provide two authoring APIs: a compound API (`Breadcrumbs.Root` + `Breadcrumbs.Item`) and a
  declarative `items` + render-function API for data-driven trails (mirroring `Tabs`).
- Treat the **last** item as the current page automatically — `aria-current="page"`,
  non-interactive, and out of the tab order. There is no per-item `isCurrent` prop; currentness
  is derived from position.
- Render a decorative, configurable `separator` (default `›`) between items, hidden from
  assistive technology.
- Support `sm`/`md` sizing (recipe variant, `md` default), per-item `href`/`target`/`rel`,
  disabled items, and typed `onAction`/`routerOptions` for client-router integration.
- Ship the full component file set: implementation, types, recipe, slots, stories, and docs
  (`.mdx`, `.dev.mdx`, `.a11y.mdx`, `.docs.spec.tsx`), plus recipe registration and barrel export.

## Capabilities

### New Capabilities

- `nimbus-breadcrumbs`: Accessible breadcrumb navigation built on React Aria Components —
  nav landmark + ordered-list semantics, automatic last-is-current page handling
  (non-interactive, `aria-current="page"`, out of tab order), decorative configurable
  separator, disabled items, `sm`/`md` sizing, router integration, and both a compound
  (`Breadcrumbs.Root`/`Breadcrumbs.Item`) and declarative (`items`) authoring API.

### Modified Capabilities

_None._ This introduces a new capability.

## Impact

- **Code**: New component under `packages/nimbus/src/components/breadcrumbs/`
  (implementation, types, recipe, slots, stories, docs, barrel export). Recipe registered in
  the theme's slot-recipe config; component exported from the package barrel.
- **Public API**: New `Breadcrumbs` export. No changes to other components.
- **Dependencies**: Uses `Breadcrumbs`/`Breadcrumb` from the already-installed
  `react-aria-components@1.19.0`. No new dependency.
- **Out of scope (follow-up)**: overflow/collapse ("Home / … / Current") truncation behavior,
  and RTL separator-glyph direction. Noted so they are tracked, not silently dropped.
