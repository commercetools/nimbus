# Tasks: Reshape ChatBubble into ChatMessage

> **API note:** `ChatMessage` is a Tier 3 compound — `ChatMessage.Root` (always
> first, publishes `sender` context) + `.Avatar`, `.Bubble`, `.Actions`,
> `.Meta`, `.Typing`. `ChatNotice` is a single leaf component (no `.Root`).
> Streaming *rendering* is delegated to the existing `Markdown` component placed
> as bubble content; `ChatMessage` only sets `aria-busy`. This supersedes the
> Experimental `ChatBubble`; no back-compat alias.

## 1. Rename component and capability

- [x] 1.1 Rename directory `packages/nimbus/src/components/chat-bubble/` →
      `chat-message/`; rename all files (`chat-bubble.*` → `chat-message.*`) and
      the `components/` parts (`chat-bubble.root.tsx` → `chat-message.root.tsx`,
      etc.).
- [x] 1.2 Rename the compound namespace object and parts: `ChatBubble` →
      `ChatMessage`; `.Root`, `.Avatar`, `.Bubble`, `.Actions`, `.Typing`
      retained; `.Footer` → `.Meta` (rename slot, component, types, and recipe
      slot `footer` → `meta`).
- [x] 1.3 Rename all public types (`ChatBubbleProps` → `ChatMessageProps`,
      `ChatBubble*SlotProps` → `ChatMessage*SlotProps`, `ChatBubbleFooterProps` →
      `ChatMessageMetaProps`, etc.) with JSDoc updated.
- [x] 1.4 Update the barrel export in
      `packages/nimbus/src/components/index.ts`: export `ChatMessage` (remove
      `ChatBubble`).

## 2. Narrow the `sender` axis

- [x] 2.1 In `chat-message.recipe.ts`, remove the `system` and `tool` values
      from the `sender` variant, leaving `user` and `agent` (default `agent`).
      Remove their per-sender styling blocks.
- [x] 2.2 Update `chat-message.types.ts` so `sender` is typed `"user" |
      "agent"`.
- [x] 2.3 Rename the recipe key `nimbusChatBubble` → `nimbusChatMessage` and
      update the slot list (`footer` → `meta`); update the theme registration in
      `src/theme/recipes/index.ts`.

## 3. Add `ChatNotice` (replaces `sender="system"`)

- [x] 3.1 Create `ChatNotice` following the Nimbus file layout (a single-slot
      component, not a compound): recipe/slot for a centered, subdued,
      avatar-less notice using the same neutral tokens the old `system` sender
      used (`neutral.2` surface, `neutral.11` text).
- [x] 3.2 Type `ChatNoticeProps` (children + style props + `data-*`); set
      `displayName`.
- [x] 3.3 Export `ChatNotice` and its types from the package barrel.
- [x] 3.4 Register the `ChatNotice` recipe in theme config.

## 4. Streaming delegation

- [x] 4.1 Keep `isStreaming` on `ChatMessage.Root` setting `aria-busy` only.
      Remove any streaming-specific rendering from `ChatMessage`; document that
      streamed text is rendered by placing `<Markdown isStreaming>` as bubble
      content.
- [x] 4.2 Keep `ChatMessage.Typing` (the `ActivityIndicator` dots +
      optional label) as the pre-first-token affordance.
- [x] 4.3 Ensure `ChatMessage.Root` does **not** create its own `aria-live`
      region (announcement is the transcript/consumer container's job).

## 5. Figma Code Connect

- [x] 5.1 Rename `chat-message.figma.tsx`; map the Figma `Sender` property
      (`User`/`Agent`) onto the `sender` variant; forward children into
      `ChatMessage.Bubble`.

## 6. Stories & tests (Storybook play functions)

- [x] 6.1 Update stories to `ChatMessage`: base, user, agent, actions, meta,
      markdown payload, overflow/wrapping, error tone, streaming (via
      `<Markdown isStreaming>` + `isStreaming` busy flag).
- [x] 6.2 Add a `ChatNotice` story (centered notice / divider) replacing the old
      `SystemMessage` story.
- [x] 6.3 Replace the old `ToolMessage` story with an `agent` message whose
      bubble content is tool output (code block via `Markdown`).
- [x] 6.4 Keep/extend a11y assertions: article-by-default, named message,
      decorative-vs-named avatar, `aria-busy` while streaming.

## 7. Documentation

- [x] 7.1 Update `chat-message.mdx`, `.dev.mdx`, `.a11y.mdx`, `.docs.spec.tsx`:
      new name, `sender` (user/agent), `ChatNotice`, tool-output-as-content,
      streaming-via-Markdown. Cross-link the transcript composition to
      `ChatMessageList` (sibling change).
- [x] 7.2 Update the lifecycle/description front-matter (still Experimental).

## 8. Spec housekeeping

- [x] 8.1 On archive, this change ADDs capability `nimbus-chat-message` and
      REMOVEs `nimbus-chat-bubble` (see the change's `specs/` deltas).

## 9. Verification

- [x] 9.1 `pnpm --filter @commercetools/nimbus typecheck:dev` clean.
- [x] 9.2 `pnpm test:dev packages/nimbus/src/components/chat-message/…` green
      (stories + play functions).
- [x] 9.3 `pnpm lint` clean; grep the repo for stale `ChatBubble` /
      `nimbusChatBubble` references.
