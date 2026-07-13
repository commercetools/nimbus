# Tasks: Reshape ChatBubble into ChatMessage

> **API note:** `ChatMessage` is a Tier 3 compound — `ChatMessage.Root` (always
> first, publishes `sender` context) + `.Avatar`, `.Body`, `.Actions`,
> `.Meta`, `.Typing`. Streaming *rendering* is delegated to the existing
> `Markdown` component placed as body content; `ChatMessage` only sets
> `aria-busy`. This supersedes the Experimental `ChatBubble`; no back-compat
> alias.

## 1. Rename component and capability

- [x] 1.1 Rename directory `packages/nimbus/src/components/chat-bubble/` →
      `chat-message/`; rename all files (`chat-bubble.*` → `chat-message.*`) and
      the `components/` parts (`chat-bubble.root.tsx` → `chat-message.root.tsx`,
      etc.).
- [x] 1.2 Rename the compound namespace object and parts: `ChatBubble` →
      `ChatMessage`; `.Root`, `.Avatar`, `.Actions`, `.Typing` retained;
      `.Bubble` → `.Body` and `.Footer` → `.Meta` (rename slot, component,
      types, and recipe slots `bubble` → `body` and `footer` → `meta`).
- [x] 1.3 Rename all public types (`ChatBubbleProps` → `ChatMessageProps`,
      `ChatBubble*SlotProps` → `ChatMessage*SlotProps`, `ChatBubbleBubbleProps` →
      `ChatMessageBodyProps`, `ChatBubbleFooterProps` → `ChatMessageMetaProps`,
      etc.) with JSDoc updated.
- [x] 1.4 Update the barrel export in
      `packages/nimbus/src/components/index.ts`: export `ChatMessage` (remove
      `ChatBubble`).

## 2. Narrow the `sender` axis

- [x] 2.1 In `chat-message.recipe.ts`, remove the `system` and `tool` values
      from the `sender` variant, leaving `user` and `assistant` (default
      `assistant`). Remove their per-sender styling blocks.
- [x] 2.2 Update `chat-message.types.ts` so `sender` is typed `"user" |
      "assistant"`.
- [x] 2.3 Rename the recipe key `nimbusChatBubble` → `nimbusChatMessage` and
      update the slot list (`bubble` → `body`, `footer` → `meta`); update the
      theme registration in `src/theme/recipes/index.ts`.

## 3. Streaming delegation

- [x] 3.1 Keep `isStreaming` on `ChatMessage.Root` setting `aria-busy` only.
      Remove any streaming-specific rendering from `ChatMessage`; document that
      streamed text is rendered by placing `<Markdown isStreaming>` as body
      content.
- [x] 3.2 Keep `ChatMessage.Typing` (the `ActivityIndicator` dots +
      optional label) as the pre-first-token affordance.
- [x] 3.3 Ensure `ChatMessage.Root` does **not** create its own `aria-live`
      region (announcement is the transcript/consumer container's job).

## 4. Figma Code Connect

- [x] 4.1 Rename `chat-message.figma.tsx`; map the Figma `Sender` property
      (`User`/`Agent`, whose `Agent` value maps to `sender="assistant"`) onto
      the `sender` variant; forward children into `ChatMessage.Body`.

## 5. Stories & tests (Storybook play functions)

- [x] 5.1 Update stories to `ChatMessage`: base, user, assistant, actions, meta,
      markdown payload, overflow/wrapping, error tone, streaming (via
      `<Markdown isStreaming>` + `isStreaming` busy flag).
- [x] 5.2 Replace the old `ToolMessage` story with an `assistant` message whose
      body content is tool output (code block via `Markdown`).
- [x] 5.3 Keep/extend a11y assertions: article-by-default, named message,
      decorative-vs-named avatar, `aria-busy` while streaming.

## 6. Documentation

- [x] 6.1 Update `chat-message.mdx`, `.dev.mdx`, `.a11y.mdx`, `.docs.spec.tsx`:
      new name, `sender` (user/assistant), tool-output-as-content,
      streaming-via-Markdown. Cross-link the transcript composition to
      `ChatMessageList` (sibling change).
- [x] 6.2 Update the lifecycle/description front-matter (still Experimental).

## 7. Spec housekeeping

- [x] 7.1 On archive, this change ADDs capability `nimbus-chat-message` and
      REMOVEs `nimbus-chat-bubble` (see the change's `specs/` deltas).

## 8. Verification

- [x] 8.1 `pnpm --filter @commercetools/nimbus typecheck:dev` clean.
- [x] 8.2 `pnpm test:dev packages/nimbus/src/components/chat-message/…` green
      (stories + play functions).
- [x] 8.3 `pnpm lint` clean; grep the repo for stale `ChatBubble` /
      `nimbusChatBubble` references.
