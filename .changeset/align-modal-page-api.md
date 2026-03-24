---
"@commercetools/nimbus": minor
---

feat(modal-page): align ModalPage API with DefaultPage component

**Breaking changes to ModalPage (Experimental):**

- `ModalPage.Title` now takes `children` instead of `title`/`subtitle` string
  props
- Added `ModalPage.Subtitle` as a separate subcomponent for subtitle text
- `ModalPage.Content` is now a plain wrapper — use `PageContent.Root` explicitly
  for width constraints and column layouts
- Removed `ModalPage.Column` re-export — use `PageContent.Column` directly
- Added `ModalPage.TabNav` slot for tabular page patterns (mirrors
  DefaultPage.TabNav)
