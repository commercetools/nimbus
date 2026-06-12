---
"@commercetools/nimbus": minor
---

Add user-defined theme support with color palette generation.

- New `@commercetools/nimbus-theme-generator` package: generate Radix-compatible
  12-step color scales from a single base hex color, validate WCAG contrast, and
  create custom Chakra systems with `createNimbusTheme()`
- `NimbusProvider` accepts a new `theme` prop for custom themes, with automatic
  inheritance for nested providers
- Support for overriding typography, spacing, radii, and other design tokens
  alongside custom color palettes
- Export `themeConfig` from `@commercetools/nimbus` so consumers can extend the
  default theme
