---
"@commercetools/nimbus": minor
---

MainPage: add MainPage compound component for top-level page layouts

- `MainPage.Root` — CSS grid page skeleton with header, content, footer rows
- `MainPage.Header` — Flex container positioning Title and Actions
- `MainPage.Title` — Nimbus Heading (h1) with `title` and optional `subtitle`
  props, matching AppKit page title styling
- `MainPage.Actions` — Right-aligned container for header action buttons
- `MainPage.Content` — Wraps PageContent.Root, forwarding `variant` and
  `columns` props
- `MainPage.Column` — Re-export of PageContent.Column for multi-column layouts
- `MainPage.Footer` — Optional footer for form actions, collapses when omitted
- Designer overview, implementation docs, guidelines, and migration guide from
  AppKit
