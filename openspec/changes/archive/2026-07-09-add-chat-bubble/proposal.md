# Change: Add ChatBubble component

## Why

Nimbus has no primitive for a single message in an AI chat / assistant feed.
Consumers building these surfaces (the same agentic/LLM UIs that drove
`Markdown` and `ActivityIndicator`) currently hand-roll the message bubble:
avatar-beside-bubble layout, per-sender direction and color, an actions row, a
metadata/footer row, and a streaming "typing" affordance — restyling each to the
design system and, too often, getting the accessibility wrong (sender conveyed
by color alone; a decorative avatar announced as a "user").

`ChatBubble` fills that gap with one focused job: **lay out and style a single
chat message**, exposing composable slots the consumer fills with their own
content. It is deliberately a _single-message_ primitive — the surrounding feed
and any live region are the consumer's to compose — so it stays flexible across
the many different chat UIs teams build on top of it.

> **History:** an initial version of this component shipped ahead of this spec
> (commit `d2a6636f7`, FEC-987) with `Root`/`Avatar`/`Bubble`/`Actions`/
> `Feedback` and a two-value `sender`. This change **retroactively specifies**
> the component and folds in the follow-up hardening from a three-reviewer pass:
> content-overflow fix, accessibility defaults, an extended sender axis, an
> `error` tone, a streaming affordance, and the `Feedback`→`Footer` rename.
> Since the component was never released, these are not breaking changes.

## What Changes

**Component:** `ChatBubble` (a compound component — `ChatBubble.Root` plus five
composable parts). **Package:** `@commercetools/nimbus` **Category:** Feedback.

### Compound API

```tsx
<ChatBubble.Root
  sender="agent"
  tone="neutral"
  aria-label="Message from the assistant"
>
  <ChatBubble.Avatar>
    <AutoAwesome />
  </ChatBubble.Avatar>
  <ChatBubble.Bubble>
    <Markdown>{reply}</Markdown>
    <ChatBubble.Actions>
      <Button variant="outline">Dismiss</Button>
      <Button variant="solid">Approve</Button>
    </ChatBubble.Actions>
  </ChatBubble.Bubble>
  <ChatBubble.Footer>
    <Link>How was this generated?</Link>
    <Text>Apr 13, 11:56pm</Text>
  </ChatBubble.Footer>
</ChatBubble.Root>
```

- **`ChatBubble.Root`** — the CSS Grid container. `sender`
  (`"user" | "agent" | "system" | "tool"`, default `"agent"`) selects layout
  direction and per-sender surface. `tone` (`"neutral" | "error"`, default
  `"neutral"`) is an orthogonal status overlay that tints the bubble for a
  failed generation. `isStreaming` marks the message as generating (sets
  `aria-busy`). Renders a semantic `<article>` by default; overridable via `as`.
- **`ChatBubble.Avatar`** — wraps the Nimbus `Avatar` (`size="2xs"`), colored
  per sender. Content via `firstName`/`lastName`, `src`, or a custom icon as
  `children`. **Decorative by default** (`aria-hidden`) unless named.
- **`ChatBubble.Bubble`** — the rounded card holding the payload; long,
  unbreakable content wraps inside it rather than overflowing.
- **`ChatBubble.Actions`** — layout-only right-aligned button row inside the
  bubble.
- **`ChatBubble.Footer`** — layout-only `space-between` row below the bubble
  (timestamp, provenance links, reaction icons).
- **`ChatBubble.Typing`** — animated dots (reusing `ActivityIndicator`) plus an
  optional visible label, for a streaming reply.

### Slot recipe

- Registered as `nimbusChatBubble`. Slots: `root`, `avatar`, `bubble`,
  `actions`, `footer`, `typing`.
- Variants: `sender` (`user`/`agent`/`system`/`tool`) and `tone`
  (`neutral`/`error`). Grid layout, not a flat flex row, so the footer aligns
  under the bubble column while the avatar occupies only the first row.

### Accessibility posture — options, not forced structure

The container semantics of a chat feed belong to the consumer, so ChatBubble
provides **accessible defaults + escape hatches + documented composition
recipes** rather than mandating structure:

- Root is an `<article>` by default (a feed item per the ARIA APG), overridable.
- The sender is named for assistive tech via `aria-label`/`aria-labelledby` on
  Root — never auto-derived (and wrongly) from the avatar.
- The avatar is decorative by default so a nameless sender glyph does not
  announce a misleading generic label (fixes a real WCAG 4.1.2 / 1.3.1 defect in
  the shipped version).
- The recommended transcript container is documented:
  `role="log" aria-live="polite"` (valid + announces streamed replies), or
  `role="feed"` with only `article` children.

## Out of scope (v1)

- **A chat _container_/feed component.** ChatBubble is a single message; the
  transcript, virtualization, and scroll management are the consumer's (or a
  future `ChatFeed`).
- **Message send/compose input**, retry/regenerate orchestration, and per-token
  streaming state management — the component only reflects `isStreaming`.
- **Reaction/vote state** — `Footer` is layout-only; consumers own the controls.

## Rejected alternatives

- **Reusing `Card` for the bubble** — the ticket explicitly calls for a
  dedicated recipe; the bubble's per-sender direction, surface, max-width and
  the footer-aligns-under-bubble grid are not Card's concerns.
- **A flat flex row `[avatar, bubble, footer]`** — cannot express "footer aligns
  under the bubble column"; CSS Grid is the right tool.
- **Cramming `error` into `sender`** — an agent message can _fail_, so error is
  a status tone orthogonal to origin, not a fifth sender.
- **Baking feed / live-region semantics into the component** — would force one
  container shape onto every consumer; provided as documented recipes instead.

## Impact

- **New component:** `packages/nimbus/src/components/chat-bubble/`.
- **New spec:** `nimbus-chat-bubble`.
- **Barrel export** from `packages/nimbus/src/components/index.ts` (already
  present).
- **Recipe registration** `nimbusChatBubble` in
  `packages/nimbus/src/theme/slot-recipes/index.ts` (already present).
- **`Avatar` (patch):** custom `children` render (already shipped);
  additionally, a decorative avatar (`aria-hidden`) no longer injects the
  generic "avatar" label. Additive, non-breaking.
- **No new dependencies**; reuses `Avatar` and `ActivityIndicator`.
