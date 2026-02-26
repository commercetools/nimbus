---
"@commercetools/nimbus": minor
---

Add link-based tab navigation support:

- Add `href`, `target`, `rel`, and `routerOptions` props to `TabProps` and
  `TabItemProps` for router-integrated tab navigation
- Add `shouldForceMount` prop to `TabPanelProps` to keep panels mounted in the
  DOM when not selected
- Export additional public types: `TabProps`, `TabPanelsProps`, `TabPanelProps`

**Breaking:** `TabPanelProps.tabs` has been removed and replaced with
`TabPanelProps.id`. The `tabs` prop on individual panels was vestigial and
non-functional, so this is unlikely to affect consumers.
