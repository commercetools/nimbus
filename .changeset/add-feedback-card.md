---
"@commercetools/nimbus": minor
---

**FeedbackCard**: new layout-only pattern — an inline "soft confirmation" card
for agent chat surfaces, shown after a suggestion is approved or rejected to
prompt the user to confirm or undo. Compose `FeedbackCard.Root`,
`FeedbackCard.Content`, and `FeedbackCard.Action`.

- Responsive wrapping row: the message sits on the leading edge and a single
  action (e.g. _Undo_) on the trailing edge; the action wraps below the message
  on narrow containers.
- No `variant` prop — express approve vs. reject (or any context) with standard
  Chakra style props (`bg`, `border`, `borderRadius`, `padding`) on
  `FeedbackCard.Root`.
- Renders no text or button of its own: provide your title/subtitle as
  `FeedbackCard.Content` children and your own `Button` inside
  `FeedbackCard.Action`.
- Layout-only and unopinionated about semantics: `Root` is a neutral element
  with no implicit ARIA role and forwards `role` / `aria-*`, so you can opt into
  `role="group"` when you want the card announced as a single unit.
