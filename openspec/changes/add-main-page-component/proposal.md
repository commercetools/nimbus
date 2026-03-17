# Change: Add MainPage Compound Component

## Why

Consumers need a page-level layout component that provides a standard page
skeleton with title, header actions, content area, and optional footer. The
Merchant Center currently provides four separate components (`FormMainPage`,
`InfoMainPage`, `TabularMainPage`, `CustomFormMainPage`) with overlapping APIs
and built-in form controls. Nimbus needs a single composable compound component
that covers all four use cases through composition rather than configuration.

## What Changes

- **NEW** `MainPage` compound component with `Root`, `Header`, `Title`,
  `Actions`, `Content`, and `Footer` parts
- **NEW** `nimbusMainPage` slot recipe with slots: root, header, title, actions,
  content, footer
- **NEW** `MainPage.Content` wraps `PageContent.Root` internally, forwarding
  `variant` and `columns` props
- **NEW** `MainPage.Footer` is optional — omit for info/read-only pages
- **NEW** Stories covering three page patterns: info, form (with footer),
  tabular (with Tabs)
- **NEW** Developer documentation (`main-page.dev.mdx`), component overview
  (`main-page.mdx`), and designer guidelines (`main-page.guidelines.mdx`)
- **MODIFIED** `packages/nimbus/src/components/index.ts` adds MainPage export
- **MODIFIED** `packages/nimbus/src/theme/slot-recipes/index.ts` registers
  `nimbusMainPage` recipe

## Impact

- Affected specs: none (new component)
- Dependencies: `PageContent` component (from CRAFT-2161 branch)
- Affected code:
  - `packages/nimbus/src/components/main-page/` (new)
  - `packages/nimbus/src/components/index.ts` (export added)
  - `packages/nimbus/src/theme/slot-recipes/index.ts` (recipe registered)
