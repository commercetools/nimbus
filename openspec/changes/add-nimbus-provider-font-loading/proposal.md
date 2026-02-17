# Change: Add Inter Font Loading to NimbusProvider

## Why

Nimbus uses Inter as its font of choice but does not provide a mechanism to load it. This causes the design system to fall back to system fonts when used standalone (outside of Merchant Center where ui-kit/app-kit loads the fonts). The font is foundational to Nimbus's visual identity and should be provided by the design system itself rather than relying on host applications.

## What Changes

- Add `loadFonts` prop to `NimbusProvider` (default: `true`) to control Inter font loading
- Implement font loading via Google Fonts CSS API v2 using preconnect links and stylesheet injection
- Support opt-out for contexts where fonts are already loaded (e.g., Merchant Center)
- Provide automatic deduplication to handle multiple `NimbusProvider` instances
- Ensure SSR compatibility and proper cleanup on unmount

## Impact

- **Affected specs**: `nimbus-nimbus-provider`
- **Affected code**:
  - `packages/nimbus/src/components/nimbus-provider/nimbus-provider.tsx` - Add font loading via InterFontLoader component
  - `packages/nimbus/src/components/nimbus-provider/nimbus-provider.types.ts` - Add `loadFonts` prop
  - `packages/nimbus/src/components/nimbus-provider/nimbus-provider.spec.tsx` - Unit tests for font loading behavior
- **Breaking**: No breaking changes - new functionality is opt-out with safe defaults
- **Migration**: Merchant Center should add `loadFonts={false}` to avoid duplicate font loading
