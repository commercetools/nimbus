# Design: ChatMessage (reshape of ChatBubble)

## Context

This is the first of a planned **`Chat*` component family** built to complete
Nimbus's chat story proactively (no single blocking consumer; scope driven by
design-system completeness). The family is designed in **two tiers that stop at
the same responsibility line**:

```
┌─ NIMBUS ────────────────────────────────────────────────┐
│  Layer 1 · Presentation      layout · styling · a11y      │
│  Layer 2 · Local UI behavior  self-contained, no data     │
│  ── the line ───────────────────────────────────────────  │
├─ THE CONSUMER'S APP ─────────────────────────────────────┤
│  Layer 3 · Runtime / data     message store · AI transport│
│                               · streaming orchestration    │
└───────────────────────────────────────────────────────────┘
```

- **Primitives** (composable): `ChatMessage`, `ChatNotice` (this change),
  `ChatMessageList` (sibling change), `ChatComposer` (future).
- **Pattern component** (`Chat`, future): a composition of the primitives with a
  controlled, flat prop API (`messages`, `onSendMessage`, `renderMessage`).

Both tiers stop at the same line: Nimbus owns presentation + self-contained UI
behavior; the app owns message state, transport, and streaming orchestration.
`ChatMessage` is a Layer 1–2 primitive.

## Relationship kinds → syntax

The family deliberately uses two different mechanisms to encode two different
kinds of relationship, so the code reads as what it is:

- **Compound (dot-notation, shared context)** = *parts of one whole that share
  hidden context.* `ChatMessage.Root` publishes `sender`; `.Avatar`, `.Bubble`,
  `.Actions`, `.Meta` read it. This is the one place compound is earned in this
  change — the parts are the fixed anatomy of a message and are meaningless
  outside it.
- **Peers in a name family (shared `Chat` prefix)** = *independent components a
  layout composes.* `ChatMessage`, `ChatNotice`, `ChatMessageList` are peers,
  not one compound; they must not be dot-notated under a single root, which
  would falsely imply shared context.

## Responsibilities & seams

### `ChatMessage` — one participant's turn (compound)

- **Owns:** the `sender` context (`user | agent`) → alignment, palette, avatar
  side; the grid layout of avatar + bubble + meta + actions; `<article>`
  semantics and accessible name; the busy flag while streaming.
- **Refuses to own:** the content (crosses the seam as `children` into
  `.Bubble`); scrolling; message data.
- **Seams:**
  - *to the transcript* — it is just a block; it does not know it is in a list.
  - *to its parts* — a React context carrying `sender` (and streaming/busy) so
    parts self-place without prop-drilling. This shared context is what makes it
    a legitimate compound.
  - *to content* — `.Bubble` takes children and never inspects them
    ("presentational message surface"). This is the "I don't care what consumers
    put in the bubble" contract, made honest by a content-blind frame.

### `ChatNotice` — a non-message interjection (leaf)

- **Owns:** centered, subdued, avatar-less presentation of a transcript
  interjection.
- **Why separate:** its responsibilities are the inverse of a message. Kept a
  leaf (no `Root`) because it establishes no context; it fills a transcript slot
  the way a message does.

## Streaming: three owners

| Responsibility | Owner | Mechanism |
| --- | --- | --- |
| Safe incremental **rendering** of streamed text | `Markdown` (as bubble content) | `isStreaming` (`remend` + block memoization) |
| **Announcing** streamed/appended content to AT | transcript live region (`ChatMessageList`; consumer container until then) | `role="log"` `aria-live="polite"` |
| **Flagging busy** + typing affordance | `ChatMessage.Root` | `isStreaming` → `aria-busy`; `ChatMessage.Typing` for pre-first-token dots |

`ChatMessage` renders nothing streaming-specific and must not create its own
live region (a region mounted with its content is not reliably announced) — this
is why announcement lives on the always-present transcript container.

## Accessibility (unchanged from ChatBubble, restated)

- `<article>` by default; consumer overrides element via `as` and role/name via
  `role`/`aria-label`/`aria-labelledby` (consumer value wins).
- Avatar is decorative (`aria-hidden`) unless given `firstName`/`lastName` or an
  explicit `aria-label`.
- Sender must be conveyable to AT by more than color/position — via the
  message's accessible name.
- `tone="error"` is a visual cue only; pair with visible text.

## Migration notes

- `ChatBubble.Root` → `ChatMessage.Root`; `.Avatar`/`.Bubble`/`.Actions`
  unchanged in role; `.Footer` → `.Meta`; `.Typing` retained.
- `sender="system"` usage → `ChatNotice`.
- `sender="tool"` usage → an `agent` message whose bubble content is the tool
  output (code block / custom-tag / composed brick).
- Streaming usage → place `<Markdown isStreaming>` as bubble content; keep
  `isStreaming` on `ChatMessage.Root` for the busy flag.
