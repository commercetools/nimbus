## Why

The RadioInput option label has no explicit font size. It inherits the size of
the surrounding element, so the same radio input looks different in different
places. The first fix on this branch set a fixed 14px label, but 14px next to the
20px indicator looks less balanced than 16px, and a fixed value gives consumers
no way to choose a smaller radio input. Other Nimbus components (Button,
Checkbox) solve this with a `size` prop, and the RadioInput spec already lists
one, but it was never implemented.

## What Changes

- Add a `size` prop to `RadioInput.Root` with the values `sm` and `md`. The
  default is `md`.
- `md`: label uses text style `md` (16px), indicator is 20px (the current size).
- `sm`: label uses text style `sm` (14px), indicator is 16px.
- The gap between stacked options depends on the size: 8px for `sm`, 12px for
  `md`. The gap between options in a row is 16px for both sizes.
- Replace the fixed 14px label font size added earlier on this branch with the
  text style of the selected size.
- **BREAKING (visual only):** the gap between options changes. Stacked options
  were 16px apart and options in a row were 24px apart. The label size also
  becomes 16px by default instead of the inherited size, which is the body size
  in most layouts.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `nimbus-radio-input`: the "Size Options" requirement lists `sm`, `md` and `lg`,
  but `lg` was never implemented. It changes to `sm` and `md`, and it now
  defines the label text style, indicator size and option gap for each size.

## Impact

- `packages/nimbus/src/components/radio-input/`: recipe, types, stories and
  documentation.
- `.changeset/`: one minor changeset for the new prop.
- No new dependencies. Consumers that use the default size see a small visual
  change in the gaps and in the label size where the surrounding text was not
  16px.
