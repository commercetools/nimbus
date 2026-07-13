# Change: Add the ChatMessage component

## Why

Nimbus's chat story is being built out proactively as a coherent **`Chat*`**
component family (no single blocking consumer; scope is driven by design-system
completeness). `ChatMessage` is the first member: the primitive that renders
**one participant's turn** in a conversation.

Deep research across mature chat/message components (Vercel AI Elements,
agent-ui, Ant Design X, MUI X Chat, LlamaIndex chat-ui, Stream Chat, shadcn)
surfaced three patterns that shape the design:

1. **A single-message component is paired with a list container.** The
   transcript concerns (scroll, autoscroll, live region) belong to a sibling
   list, not to the message. (Delivered by the `add-chat-message-list` change.)
2. **Tool output is content, and system notices are a separate thing** — not
   sender values. A single agent turn can interleave prose and a tool call, so
   it cannot be expressed on a one-sender-per-message axis; and a centered,
   avatar-less system notice is the *opposite* of a message, not a variant of
   one.
3. **Streaming rendering is a solved, owned concern** — Nimbus's own `Markdown`
   component already does safe incremental rendering of streamed LLM output
   (`isStreaming`: `remend` completion + block memoization + coalesced
   completion announcement). `ChatMessage` delegates to it rather than
   reinventing a weaker path.

The unit is named a **message** (the field's overwhelming convention), and the
card slot is named **`.Body`** — a role-based, style-agnostic name — so a future
non-rounded (flat, brutalist) treatment never makes the name lie.

## What Changes

**Component:** `ChatMessage` (Tier 3 compound).
**Package:** `@commercetools/nimbus`.
**Category:** Chat.

### 1. Compound anatomy; the card slot is `.Body`

`ChatMessage.Root` publishes the `sender` context that `.Avatar`, `.Body`,
`.Actions`, and `.Meta` read to place and color themselves — the shared context
is what earns the compound (dot-notation) form. `.Meta` names message metadata
(the meaning, not a position), and `.Body` is the role-based card slot:

```tsx
<ChatMessage.Root sender="agent">
  <ChatMessage.Avatar><AutoAwesome /></ChatMessage.Avatar>
  <ChatMessage.Body>
    <Markdown isStreaming={streaming}>{reply}</Markdown>
  </ChatMessage.Body>
  <ChatMessage.Actions>{/* copy · regenerate */}</ChatMessage.Actions>
  <ChatMessage.Meta>Apr 13, 11:56pm</ChatMessage.Meta>
</ChatMessage.Root>
```

### 2. `sender` is `user | agent`

`sender` means only "which participant," which is all it should ever mean —
`user | agent` names the two participants (the human and the AI agent). It
deliberately does **not** carry `system` or `tool`:

- **`system` → out of scope**: a system notice (e.g. "Conversation history was
  cleared", a date divider) isn't a message — its presentation is the opposite
  of a message (no sender, no avatar, no actions), so folding it into
  `ChatMessage` would corrupt the message's single responsibility. It also isn't
  a standardized component in this release: a consumer renders their own content
  (e.g. inside a `ChatMessageList.Item`, which is content-agnostic).
- **`tool` → content**: tool/function output is *what an agent turn
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
  consumer's container).
- **Flagging busy** + an optional pre-first-token typing affordance
  (`ChatMessage.Typing`) → `ChatMessage.Root` sets `aria-busy` via
  `isStreaming`.

### 4. Status tone and accessibility

`tone="neutral" | "error"` is an orthogonal status overlay (an agent message can
still fail, so error is a tone, not a sender). The accessibility model:
`<article>` by default, overridable via `as`/`role`; the message is named via
`aria-label`/`aria-labelledby`; the avatar is decorative unless named; the sender
is never conveyed by color/position alone.

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

- **`sender="tool" | "system"`** — rejected: conflates content and container
  concerns with participant identity; cannot express a mixed prose+tool agent
  turn; makes the message responsible for "sometimes I am not a message."
- **A message-owned streaming renderer** — rejected: duplicates `Markdown`,
  which already solves incomplete-markdown streaming (`remend`) that this
  component would otherwise get wrong.

## Impact

- **New capability `nimbus-chat-message`.** This supersedes the Experimental
  `nimbus-chat-bubble` capability, which is removed by this change.
- **New component** `packages/nimbus/src/components/chat-message/` — parts,
  types, recipe, slots, stories, docs, and Figma Code Connect.
- **Recipe** registered as `nimbusChatMessage` in the theme; `sender`
  (`user`/`agent`) and `tone` (`neutral`/`error`) variants.
- **Barrel export** `ChatMessage` and its public types.
- Lifecycle **Experimental**; noted in the changeset.
- No tokens-package changes.
