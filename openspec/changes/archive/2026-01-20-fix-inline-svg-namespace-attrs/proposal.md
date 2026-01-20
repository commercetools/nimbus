# Change: Fix InlineSvg Namespace Attribute Conversion

## Why

InlineSvg produces React DOM property warnings when SVG markup contains XML
namespace attributes like `xmlns:xlink`. The current attribute conversion logic
only handles kebab-case attributes (e.g., `stroke-width` → `strokeWidth`) but
doesn't handle colon-separated namespace prefixes. This results in console
warnings like "Invalid DOM property `xmlns:xlink`. Did you mean `xmlnsXlink`?"
when rendering SVG content exported from most SVG editors.

While this is a warning-only issue that doesn't affect functionality, it creates
console noise and indicates incomplete React attribute normalization. The fix is
trivial (one character change) and eliminates a common source of confusion for
developers working with SVG content.

## What Changes

- Update the attribute name conversion regex in `useInlineSvg` hook to handle
  both kebab-case and colon-separated namespace prefixes
- Change regex from `/-([a-z])/g` to `/[-:]([a-z])/g` to convert both hyphens
  and colons to camelCase
- Existing behavior for kebab-case attributes (e.g., `stroke-width` →
  `strokeWidth`) is preserved
- New behavior for namespace attributes: `xmlns:xlink` → `xmlnsXlink`,
  `xml:lang` → `xmlLang`

## Impact

- **Affected specs**: `nimbus-inline-svg`
- **Affected code**:
  `packages/nimbus/src/components/inline-svg/hooks/use-inline-svg.ts` (line
  54-55)
- **User impact**: Low - eliminates console warnings, no behavioral changes
- **Breaking changes**: None - purely additive fix
- **Testing**: Existing `SecurityTest` story in `inline-svg.stories.tsx` already
  exercises this code path and will validate the fix
