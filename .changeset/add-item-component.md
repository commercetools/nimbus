---
"@commercetools/nimbus": minor
---

`Item`: new compound component for a horizontal content row — `Item.Root` with
`.Header`, `.Media`, `.Content` (wrapping `.Title` and `.Description`),
`.Actions`, and `.Footer`. Use it for settings rows, notification entries, and
file/resource rows.

- Presentational by default. Pass an `href` to `Item.Root` to turn the whole row
  into an accessible, router-aware link; controls in `Item.Actions` stay
  independently operable and never trigger row navigation.
- `variant` (`plain` | `outline` | `subtle`) and `size` (`xs` | `sm` | `md`) set
  the row's treatment and density. `Item.Media` takes its own `variant`
  (`default` | `icon` | `image`) for icons, avatars, or thumbnails.

`ItemGroup`: new compound component that stacks `Item` rows into a group —
`ItemGroup.Root` with `.Separator` for dividers between rows.

Both components are **Beta**.
