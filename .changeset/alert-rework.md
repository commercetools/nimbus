---
"@commercetools/nimbus": minor
---

`Alert`:

**Action required:** `Alert.Root` now defaults to `role="status"` (polite)
instead of `role="alert"` (assertive) on every palette except `critical`, which
keeps `role="alert"`. `role` can now be overridden. Add `role="alert"` to any
non-critical alert that must interrupt a screen reader. A live region only
announces content that changes after the region is already on the page, so an
alert mounted together with its message may not be announced — keep `Alert.Root`
mounted and change its children, or pass `role="alert"`. See the Accessibility
tab, "Live-region priming".

New:

- `variant="accent-start"` — a neutral card with a 4px status-colored bar on the
  leading edge, close to the treatment `Toast` uses. The card and text stay
  neutral while the bar, the icon and any buttons in `Alert.Actions` carry the
  status color.
- `colorPalette` accepts every Nimbus palette. `critical`, `warning`,
  `positive`, `info` and `primary` each have their own icon; every other
  palette, `neutral` included, shows the neutral icon. A responsive
  `colorPalette` takes its icon and default `role` from its base value.
- `Alert.Icon` for a custom icon; `hideIcon` to remove it.
- `as` on `Alert.Title` and `Alert.Description`.

Fixed:

- The icon and dismiss button now line up with the first line of text instead of
  sitting about 2px above it, and both scale with a `fontSize` set on
  `Alert.Root`.
- `variant` and `size` passed to `Alert.DismissButton` now apply. Before, they
  were ignored and the button always rendered as `ghost` / `2xs`.

Other visible changes:

- An alert without `variant` keeps its unstyled, flush look.
- `variant="flat"` now has the same padding as `outlined` and `accent-start`.
  Omit `variant` if you relied on `flat` sitting flush with its container.
- `outlined` and `accent-start` draw their outline as an inset shadow instead of
  a border, so the card is 1px roomier inside.
- Slightly more horizontal padding in every variant, a tighter gap between title
  and description, and buttons inside `Alert.Actions` are now spaced apart.
