---
"@commercetools/nimbus": minor
---

`Alert`:

**Action required:** `Alert.Root` now defaults to `role="status"` (polite)
instead of `role="alert"` (assertive) on every palette except `critical`, which
keeps `role="alert"`. `role` can now be overridden. Add `role="alert"` to any
non-critical alert that must interrupt a screen reader.

New:

- `variant="accent-start"` — a neutral card with a status-colored bar on the
  leading edge, the treatment `Toast` uses. The card and text stay neutral while
  the bar, the icon and any buttons in `Alert.Actions` carry the status color.
- `colorPalette` accepts the full semantic set — `neutral` and `primary` join
  the four severities, each with its own icon.
- `Alert.Icon` for a custom icon; `hideIcon` to remove it.
- `as` on `Alert.Title` and `Alert.Description`.

Fixed: the icon and dismiss button now line up with the first line of text
instead of sitting about 2px above it, and both scale with a `fontSize` set on
`Alert.Root`.

Other visible changes:

- Omitting `variant` renders the `outlined` card; it previously rendered
  unstyled.
- `variant="flat"` now shares the same box as the other variants — add
  `padding="0"` if you relied on it sitting flush with its container.
- Slightly more horizontal padding, and buttons inside `Alert.Actions` are now
  spaced apart.
