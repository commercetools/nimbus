---
"@commercetools/nimbus": minor
---

**Alert: layout + emphasis variants, neutral status, configurable announcement,
and a public icon slot**

Alert now covers the inline agent-confirmation use case previously served by the
(unreleased) FeedbackCard pattern, which has been removed.

New capabilities:

- `layout="stack" | "inline" | "banner"` — the default `stack`, a horizontal
  `inline` row (content leading, actions trailing, wraps on narrow widths), and
  a full-width `banner`.
- `variant="flat" | "subtle" | "outline" | "solid"` emphasis. `subtle` is now
  the default. `variant="outlined"` is a deprecated alias for `subtle` and
  renders identically.
- `colorPalette="neutral"` is now supported in addition to
  `info`/`positive`/`warning`/`critical`.
- `Alert.Icon` is now a public slot for a custom icon; `hideIcon` removes the
  icon entirely.
- `dismissible` + `onDismiss` render a built-in localized dismiss button (the
  composable `Alert.DismissButton` still works).
- `Alert.Title` now renders a `Heading` (defaulting to a non-heading element;
  use `as` to promote it); `Alert.Description` renders `Text`.

**Behavior changes (please review):**

- The default announcement politeness changed from assertive to polite:
  `Alert.Root` now defaults to `role="status"` instead of `role="alert"`. **Add
  `role="alert"` to any critical alert that must interrupt the user
  immediately.** The `role` prop is now overridable.
- Rendering an Alert without a `variant` now applies the `subtle` surface
  (previously it rendered unstyled). `variant="outlined"` and `variant="flat"`
  are unchanged.
