---
"@commercetools/nimbus": minor
---

`Avatar`:

- `firstName` and `lastName` are now optional. Avatars with missing or partial
  names render a generic person icon and a localized accessible label.
- Fixes a crash when `firstName` or `lastName` was passed as an empty string.
- Names with leading or trailing whitespace, emoji, and non-Latin characters now
  produce correct initials.
