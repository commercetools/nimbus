---
"@commercetools/nimbus": minor
---

`ChatBubble`: new compound component for a single message in an AI chat feed.
Composes an avatar, a bubble container, and two layout-only slots you fill with
your own content: `ChatBubble.Actions` (inside the bubble) and
`ChatBubble.Feedback` (below it).

- `sender` (`"user" | "agent"`, default `"agent"`) sets the layout direction —
  avatar leading for the agent, trailing for the user — and the sender-specific
  bubble and avatar styling.
- `ChatBubble.Avatar` wraps the Nimbus `Avatar` at `size="2xs"` and is colored
  automatically per sender; provide the content via `firstName`/`lastName`,
  `src`, or a custom icon as `children`.
- `ChatBubble.Bubble` is the rounded card that holds the payload — plain text, a
  `Markdown` block, or any generated content. Place `ChatBubble.Actions` as its
  last child to pin action buttons to the bottom.
- `ChatBubble.Feedback` renders a `space-between` row beneath the bubble for a
  timestamp, reaction icons, links, or trust affordances.
