# Tasks: Add the ChatMessage component

> **API note:** `ChatMessage` is a Tier 3 compound — `ChatMessage.Root` (always
> first, publishes `sender` context) + `.Avatar`, `.Body`, `.Actions`,
> `.Meta`, `.Typing`. Streaming *rendering* is delegated to the existing
> `Markdown` component placed as body content; `ChatMessage` only sets
> `aria-busy`.

## 1. Scaffold the component

- [x] 1.1 Create `packages/nimbus/src/components/chat-message/` following the
      Nimbus file layout: `chat-message.tsx`, `.types.ts`, `.recipe.ts`,
      `.slots.tsx`, `.figma.tsx`, `.stories.tsx`, `.mdx`, `.dev.mdx`,
      `.a11y.mdx`, `.docs.spec.tsx`, the `components/` parts
      (`chat-message.root.tsx`, `.avatar.tsx`, `.body.tsx`, `.actions.tsx`,
      `.meta.tsx`, `.typing.tsx`), and `index.ts`.
- [x] 1.2 Define the compound namespace and parts: `ChatMessage.Root` +
      `.Avatar`, `.Body`, `.Actions`, `.Meta`, `.Typing` (the card slot is
      `.Body`, message metadata is `.Meta`).
- [x] 1.3 Define the public types (`ChatMessageProps`, `ChatMessage*SlotProps`,
      `ChatMessageBodyProps`, `ChatMessageMetaProps`, etc.) with JSDoc.
- [x] 1.4 Export `ChatMessage` and its public types from
      `packages/nimbus/src/components/index.ts`.

## 2. Define the `sender` axis

- [x] 2.1 In `chat-message.recipe.ts`, define the `sender` variant with `user`
      and `agent` values (default `agent`) and their per-sender styling blocks.
- [x] 2.2 Type `sender` as `"user" | "agent"` in `chat-message.types.ts`
      (derived from the recipe).
- [x] 2.3 Register the slot recipe as `nimbusChatMessage` (slots `root`,
      `avatar`, `body`, `actions`, `meta`, `typing`) in
      `src/theme/slot-recipes/index.ts`.

## 3. Streaming delegation

- [x] 3.1 `isStreaming` on `ChatMessage.Root` sets `aria-busy` only. No
      streaming-specific rendering in `ChatMessage`; document that streamed text
      is rendered by placing `<Markdown isStreaming>` as body content.
- [x] 3.2 `ChatMessage.Typing` (the `ActivityIndicator` dots + optional label)
      is the pre-first-token affordance.
- [x] 3.3 Ensure `ChatMessage.Root` does **not** create its own `aria-live`
      region (announcement is the transcript/consumer container's job).

## 4. Figma Code Connect

- [x] 4.1 Author `chat-message.figma.tsx`; map the Figma `Sender` property
      (`User`/`Agent`, whose `Agent` value maps to `sender="agent"`) onto the
      `sender` variant; forward children into `ChatMessage.Body`.

## 5. Stories & tests (Storybook play functions)

- [x] 5.1 Author stories for `ChatMessage`: base, user, agent, actions, meta,
      markdown payload, overflow/wrapping, error tone, streaming (via
      `<Markdown isStreaming>` + `isStreaming` busy flag).
- [x] 5.2 Add an `agent` message story whose body content is tool output (code
      block via `Markdown`).
- [x] 5.3 Cover a11y assertions: article-by-default, named message,
      decorative-vs-named avatar, `aria-busy` while streaming.

## 6. Documentation

- [x] 6.1 Author `chat-message.mdx`, `.dev.mdx`, `.a11y.mdx`, `.docs.spec.tsx`:
      `sender` (user/agent), tool-output-as-content, streaming-via-Markdown.
      Cross-link the transcript composition to `ChatMessageList` (sibling
      change).
- [x] 6.2 Set the lifecycle/description front-matter (Experimental).

## 7. Spec housekeeping

- [x] 7.1 On archive, this change ADDs capability `nimbus-chat-message` and
      REMOVEs `nimbus-chat-bubble` (see the change's `specs/` deltas).

## 8. Verification

- [x] 8.1 `pnpm --filter @commercetools/nimbus typecheck:dev` clean.
- [x] 8.2 `pnpm test:dev packages/nimbus/src/components/chat-message/…` green
      (stories + play functions).
- [x] 8.3 `pnpm lint` clean.
