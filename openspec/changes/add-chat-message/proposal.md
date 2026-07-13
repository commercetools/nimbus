# Change: Reshape ChatBubble into ChatMessage

## Why

`ChatBubble` shipped (change `2026-07-09-add-chat-bubble`, lifecycle
**Experimental**) as the *only* chat primitive in Nimbus. Deep research across
mature chat/message components (Vercel AI Elements, assistant-ui, Ant Design X,
MUI X Chat, LlamaIndex chat-ui, Stream Chat, shadcn Bubble) surfaced three
consistent patterns that the current component either fights or misses:

1. **The single-message component is paired with a list container.** ChatBubble
   punts the entire transcript (scroll, autoscroll, live region) to the consumer
   with only a doc note. (Addressed by the sibling `add-chat-message-list`
   change.)
2. **Tool output is content, and system notices are a separate thing** — not
   sender values. ChatBubble's `sender` axis absorbed `system` and `tool`, which
   don't belong there: a single assistant turn that interleaves prose and a tool
   call cannot be expressed on a one-sender-per-message axis, and a centered,
   avatar-less system notice is the *opposite* of a message, not a variant of
   one.
3. **Streaming rendering is a solved, owned concern** — Nimbus's own `Markdown`
   component already does safe incremental rendering of streamed LLM output
   (`isStreaming`: `remend` completion + block memoization + coalesced
   completion announcement). ChatBubble instead reinvented a weaker path (dots +
   `aria-busy`) and does not delegate to `Markdown`.

Separately, **"bubble" is a visual metaphor that breaks down** for the very
cases the component must serve (a system notice is not a bubble; tool output is
not a distinct bubble). The field overwhelmingly names the unit a **message**,
and "bubble" is only ever a shape word — so the metaphor is dropped from the API
entirely: the card slot is named **`.Body`**, a role-based, style-agnostic name,
so a future non-rounded (flat, brutalist) treatment does not make the name lie.

This change reshapes `ChatBubble` → `ChatMessage` as the first member of a
coherent **`Chat*`** component family, narrowing the message's responsibility to
its single honest job — *render one participant's turn* — and moving the
displaced responsibilities to where they belong. Because `ChatBubble` is
**Experimental** and only days old, this is a clean rename/reshape rather than a
deprecation cycle.

## What Changes

**Component:** `ChatBubble` → **`ChatMessage`** (Tier 3 compound).
**Package:** `@commercetools/nimbus`.
**Category:** Feedback / Chat.

### 1. Rename to `ChatMessage`; the card slot becomes `.Body`

The compound root and its parts rename, and `.Footer` becomes `.Meta` (names the
meaning — message metadata — not the position). Likewise the card slot becomes
`.Body` — a role-based name — dropping the "bubble" shape metaphor from the API
so the name stays honest under any future visual treatment:

```tsx
<ChatMessage.Root sender="assistant">
  <ChatMessage.Avatar><AutoAwesome /></ChatMessage.Avatar>
  <ChatMessage.Body>
    <Markdown isStreaming={streaming}>{reply}</Markdown>
  </ChatMessage.Body>
  <ChatMessage.Actions>{/* copy · regenerate */}</ChatMessage.Actions>
  <ChatMessage.Meta>Apr 13, 11:56pm</ChatMessage.Meta>
</ChatMessage.Root>
```

`ChatMessage.Root` publishes the `sender` context that `.Avatar`, `.Body`,
`.Actions`, and `.Meta` read to place and color themselves — the shared context
is what earns the compound (dot-notation) form.

### 2. `sender` narrows to `user | assistant`

`sender` now means only "which participant," which is all it should ever have
meant — and `user | assistant` mirrors the standard LLM message-role vocabulary.
`system` and `tool` are removed from the axis:

- **`system` → out of scope**: a system notice (e.g. "Conversation history was
  cleared", a date divider) isn't a message — its presentation is the opposite
  of a message (no sender, no avatar, no actions), so folding it into
  `ChatMessage` would corrupt the message's single responsibility. It also isn't
  a standardized component in this release: a consumer renders their own content
  (e.g. inside a `ChatMessageList.Item`, which is content-agnostic).
- **`tool` → content**: tool/function output is *what an assistant turn
  contains* — a code block, a `Markdown` custom-component tag, or a composed
  brick placed in `ChatMessage.Body` — not a participant with its own avatar
  column.

### 3. Streaming delegates to `Markdown`; the message only flags busy

Streaming has three responsibilities with three owners, no overlap:

- **Rendering** streamed text safely → the existing **`Markdown`** component
  (`isStreaming`), placed as body content. `ChatMessage` renders nothing
  streaming-specific itself.
- **Announcing** to assistive tech → the transcript's single persistent live
  region (owned by `ChatMessageList`, the sibling change; until then, the
  consumer's container, as today).
- **Flagging busy** + an optional pre-first-token typing affordance
  (`ChatMessage.Typing`) → `ChatMessage.Root` sets `aria-busy` via
  `isStreaming`.

### 4. Unchanged

`tone="neutral" | "error"` (orthogonal status overlay) stays. The accessibility
model stays: `<article>` by default, overridable via `as`/`role`; message named
via `aria-label`/`aria-labelledby`; avatar decorative unless named; sender never
conveyed by color/position alone.

## Out of scope

- **`ChatComposer`** and the **`Chat` pattern component** — separate future
  proposals (the pattern component composes the list *and* the composer, so it
  cannot be assembled until both exist).
- **`ChatMessageList`** (the transcript) — the sibling `add-chat-message-list`
  change.
- **Same-author grouping, batteries-included action components (copy/regenerate
  as first-class parts), message branching / regenerated-variant navigation** —
  deferred; `.Actions` remains a layout slot.

## Rejected alternatives

- **Keep `sender="tool"|"system"`** — rejected: conflates content and container
  concerns with participant identity; cannot express a mixed prose+tool
  assistant turn; makes the message responsible for "sometimes I am not a
  message."
- **A back-compat `ChatBubble` alias** — rejected: the capability is
  Experimental and days old; a hard rename is cheaper than carrying two names.
- **A message-owned streaming renderer** — rejected: duplicates `Markdown`,
  which already solves incomplete-markdown streaming (`remend`) that this
  component would otherwise get wrong.

## Impact

- **Supersedes capability `nimbus-chat-bubble`** → **new capability
  `nimbus-chat-message`** (this change ADDs `nimbus-chat-message` and REMOVEs
  `nimbus-chat-bubble`).
- **Rename** `packages/nimbus/src/components/chat-bubble/` →
  `chat-message/`; component parts, types, recipe, slots, stories, docs, and
  Figma Code Connect all rename.
- **Recipe key** `nimbusChatBubble` → `nimbusChatMessage`; `sender` variant
  drops `system`/`tool`; theme registration updated.
- **Barrel exports** update: `ChatMessage` and public types; `ChatBubble`
  removed.
- **Breaking rename** — acceptable under Experimental lifecycle; called out in
  the changeset.
- No tokens-package changes.
