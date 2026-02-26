---
"@commercetools/nimbus": minor
---

Add `href` prop support to Tabs for link-based tab navigation with router
integration.

**Breaking:** `TabPanelProps.tabs` has been removed and replaced with
`TabPanelProps.id`. The `tabs` prop on individual panels was vestigial and
non-functional, so this is unlikely to affect consumers.
