---
"@commercetools/nimbus-mcp": patch
---

**migrate_from_uikit**: warn about default colorPalette difference between UI
Kit and Nimbus.

Migration entries for PrimaryButton, FlatButton, SecondaryButton, Stamp (Badge),
Link, and PrimaryActionDropdown (SplitButton) now include explicit warnings that
the default color changed from primary/blue (UI Kit) to neutral/gray (Nimbus).
Each warning tells the consumer which prop to add to preserve the original
appearance.
