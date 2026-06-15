---
"@commercetools/nimbus": patch
---

`Tabs.Tab` no longer emits a React "An empty string was passed to the href
attribute" warning when rendered without an `href` (the common panel-switching
tab). Link-related props (`href`, `target`, `rel`, `routerOptions`) are now only
forwarded when an `href` is actually provided, so non-link tabs render cleanly
during server-side rendering and hydration. Tabs that do navigate via `href` are
unchanged.
