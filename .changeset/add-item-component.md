---
"@commercetools/nimbus": minor
---

`Item`: new compound component for a horizontal content row — `Item.Root` with
`.Header`, `.Media`, `.Content` (wrapping `.Title` and `.Description`),
`.Actions`, and `.Footer`. Use it for settings rows, notification entries, and
file/resource rows; it complements `Card` (a vertical container) and
`List`/`Menu` (interactive, selectable collections).

- Presentational by default. Pass an `href` to `Item.Root` and the whole row
  becomes an accessible link (keyboard-focusable, router-aware). Action controls
  placed in `Item.Actions` stay independently operable and never trigger row
  navigation.
- `variant` (`plain` | `outline` | `subtle`) and `size` (`xs` | `sm` | `md`)
  control the row's treatment and density. `Item.Media` has its own `variant`
  (`default` | `icon` | `image`) for icons, avatars, or thumbnails.

`ItemGroup`: new component that stacks `Item` rows into a group —
`ItemGroup.Root` with `.Separator` for dividers between rows.

Both components are **Experimental**.
