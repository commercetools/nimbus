# Design: ChatBubble

## Layout — CSS Grid, not a flex row

The bubble, avatar and footer have a relationship a flat flex row of
`[avatar, bubble, footer]` cannot express: the footer must align under the
**bubble column**, while the avatar occupies only the first row. So `Root` is a
two-track CSS Grid (`auto auto`): the avatar sits in one column on row 1, the
bubble in the other column on row 1, and the footer under the bubble column on
row 2. The `sender` variant swaps which column the avatar/bubble occupy — that
column swap _is_ the "layout direction."

Consequence (accepted): DOM order is fixed (avatar → bubble) while the visual
column order flips for `user`. This is fine because the avatar is
non-interactive; the a11y docs record the reading-order contract so consumers do
not place focusable content in the avatar.

## `sender` vs `tone` — two orthogonal axes

`sender` is the message's **origin** and owns direction + surface
(`user`/`agent`/`system`/`tool`). `tone` is a **status overlay**
(`neutral`/`error`). They are separate because an _agent_ message can _fail_ —
error is not a fifth origin. In the recipe, `tone` is declared after `sender` so
the error bubble bg/border win the style merge for any sender.

## Streaming — reuse `ActivityIndicator`, keep the live region with the consumer

`ChatBubble.Typing` wraps the existing `ActivityIndicator` (three animated dots)
rather than reinventing a dots animation. `ActivityIndicator` is always
decorative (`aria-hidden`) by contract, and its own guidance is explicit that a
component-owned live region does not announce reliably (a region mounted
together with its content is missed by screen readers). So:

- The **visible** typing affordance is `ChatBubble.Typing` (dots + optional
  label text passed as `children`).
- The **machine-readable** busy state is `isStreaming` on Root → `aria-busy`.
- The **announcement** stays on the consumer's transcript container
  (`role="log" aria-live="polite"`), which already exists in the DOM before its
  content changes and therefore announces reliably.

This split is why the component does not own a live region.

## Accessibility — options, not forced structure

A chat feed's container semantics belong to the consumer (feed vs log vs list;
virtualized or not), so the component ships accessible defaults with escape
hatches instead of mandating structure:

- **Root defaults to `<article>`** (a feed item per the ARIA APG) via the slot
  factory (`withProvider("article", "root")`), matching the `drawer`
  header/footer precedent of choosing a semantic base element. Consumers can
  override with `as`; `role`/`aria-*` pass through and win (spread last).
- **Sender name is explicit.** The message is named via
  `aria-label`/`aria-labelledby` on Root — never auto-derived from the avatar,
  which was the source of the shipped "Generic user avatar" defect.
- **Decorative avatar by default.** `ChatBubble.Avatar` sets `aria-hidden` on
  the inner `Avatar` unless `firstName`/`lastName`/`aria-label` is supplied. The
  base `Avatar` is also fixed to not inject the generic label when hidden — a
  general, additive improvement.
- **Documented composition** is the "options": the recommended transcript is a
  `role="log" aria-live="polite"` container of named `article`s (valid + a live
  region for streaming). `role="feed"` is offered as an alternative with the
  caveat that its children must be only `article`s (`aria-required-children`) —
  do not nest a `log` inside a `feed`.

## Avatar prop forwarding

`ChatBubble.Avatar`'s props flow to the **inner `Avatar`** (the useful surface:
`firstName`, `src`, `children`, `size`, `aria-label`), not to the grid-cell
wrapper, which exists only to occupy the avatar column. This is intentional and
documented in a code comment; `ChatBubbleAvatarProps = AvatarProps` makes the
surface exactly Avatar's.
