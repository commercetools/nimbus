## Why

Nimbus components use generous spacing defaults that prioritize readability over
information density. commercetools applications are data-heavy (product listings,
order management, customer dashboards) and users need to see more content per
screen. The current defaults force consumers to fight the design system instead
of leveraging it.

This is Phase 3 of the information-dense defaults epic. Phases 1-2 (rem
conversion and text style line-height tightening) are already committed on
`feat/information-dense-defaults`.

## What Changes

Shift padding and gap token references down ~1 stop across all ~53 recipe files.
The spacing token scale itself is unchanged — only which tokens the recipes
select from the palette.

**Spacing shift map:**

| Current Token | Current px | New Token | New px | Reduction |
| ------------- | ---------- | --------- | ------ | --------- |
| `"900"` | 36px | `"600"` | 24px | -33% |
| `"800"` | 32px | `"600"` | 24px | -25% |
| `"600"` | 24px | `"400"` | 16px | -33% |
| `"500"` | 20px | `"400"` | 16px | -20% |
| `"400"` | 16px | `"300"` | 12px | -25% |
| `"300"` | 12px | `"200"` | 8px | -33% |
| `"200"` | 8px | `"150"` | 6px | -25% |
| `"150"` | 6px | `"100"` | 4px | -33% |
| `"100"` | 4px | `"50"` | 2px | -50% |
| `"50"` | 2px | `"50"` | 2px | floor |
| `"25"` | 1px | `"25"` | 1px | floor |

The same map applies to CSS custom property values (`spacing.400` →
`spacing.300`) and `calc()` expressions (`{spacing.400}` → `{spacing.300}`).
Negative spacing values shift by the same rule.

## What Doesn't Change

- The spacing token scale values (the set of available tokens stays the same)
- Component APIs — no props, types, or interfaces change
- Font sizes or line heights (handled in Phases 1-2)
- Components with no spacing properties (ActivityIndicator, CollapsibleMotion,
  DatePicker, Group, Heading, LoadingSpinner, ScopedSearchInput, Skeleton,
  Separator, Splitter)

## Risks

- **Visual regression**: Every component gets ~25-30% tighter. Storybook visual
  review and Chromatic snapshots required for all changes.
- **Minimum spacing floor**: Values at `"50"` and `"25"` don't reduce further.
  Components already using these are at minimum density.
- **DataTable density variant**: The existing `condensed` variant may need
  reconciliation after the default gets denser.
