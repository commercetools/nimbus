# Tasks: Add ChatMessageList

> **API note:** `ChatMessageList` is a Tier 3 compound —
> `ChatMessageList.Root` (always first, wraps `ScrollArea`, owns scroll +
> autoscroll + live region + empty state) and `ChatMessageList.Item` (the
> list-membership socket that holds a `ChatMessage` or `ChatNotice`). Depends on
> `add-chat-message`.

## 1. Scaffolding

- [x] 1.1 Create `packages/nimbus/src/components/chat-message-list/` following
      the Nimbus file layout: `chat-message-list.tsx`, `.types.ts`, `.recipe.ts`,
      `.slots.tsx`, `.stories.tsx`, `.mdx`, `.dev.mdx`, `.a11y.mdx`,
      `.docs.spec.tsx`, `components/` (Root, Item), `hooks/`, `index.ts`.
- [x] 1.2 Export `ChatMessageList` and its public types from
      `packages/nimbus/src/components/index.ts`.

## 2. Root (scroll container)

- [x] 2.1 Implement `ChatMessageList.Root` wrapping `ScrollArea`; establish the
      slot recipe context (`nimbusChatMessageList`) and publish list context.
- [x] 2.2 Render the container as `role="log"` `aria-live="polite"` by default
      on the scroll viewport/region, with a consumer-overridable `aria-label`;
      keep the region always-mounted.
- [x] 2.3 Implement an empty-state slot rendered when there are no items.

## 3. Autoscroll / stick-to-bottom

- [x] 3.1 Add a `useStickToBottom` hook operating on `ScrollArea`'s viewport
      node (`viewportRef`): pin to bottom when at/near the bottom, including
      while content grows (streaming); release when the user scrolls up beyond a
      threshold.
- [x] 3.2 Respect `prefers-reduced-motion` for smooth scrolling.
- [x] 3.3 Expose an `autoScroll` prop (default on) and an imperative
      `scrollToBottom()` via `ref`.

## 4. Scroll-to-bottom affordance

- [x] 4.1 Render a "jump to latest" control (icon button) while the pin is
      released; clicking it re-engages stick-to-bottom and scrolls to the newest
      item. Provide a localized `aria-label`.

## 5. Item (list member)

- [x] 5.1 Implement `ChatMessageList.Item` owning inter-item spacing, keying,
      and the entry presentation of a newly appended item; content-agnostic
      (holds `ChatMessage` or `ChatNotice`).
- [x] 5.2 Do not assert `role="listitem"` (would conflict with the `log`
      container); provide DOM order + structural hooks only.

## 6. Recipe & theme

- [x] 6.1 Define the slot recipe `nimbusChatMessageList` (slots: `root`,
      `viewport`, `item`, `scrollToBottom`, `empty`) using design tokens;
      register it in `src/theme/recipes/index.ts`.

## 7. i18n

- [x] 7.1 Add localized strings (e.g. the scroll-to-bottom control label) under
      `Nimbus.ChatMessageList.*`.

## 8. Stories & tests (Storybook play functions)

- [x] 8.1 Mixed transcript (user + agent messages + a `ChatNotice`).
- [x] 8.2 Autoscroll pins to newest on append (including a simulated streaming
      grow).
- [x] 8.3 Scrolling up releases the pin and reveals the scroll-to-bottom
      control; clicking it re-engages stick-to-bottom.
- [x] 8.4 Container exposes `role="log"` `aria-live="polite"`.
- [x] 8.5 Empty state renders.

## 9. Documentation

- [x] 9.1 Author `.mdx` (designer), `.dev.mdx` (engineering), `.a11y.mdx`
      (log-vs-feed rationale, streaming announcement ownership), `.docs.spec.tsx`
      (consumer test examples). Cross-link `ChatMessage` / `ChatNotice`.

## 10. Verification

- [x] 10.1 `pnpm --filter @commercetools/nimbus typecheck:dev` clean.
- [x] 10.2 `pnpm test:dev packages/nimbus/src/components/chat-message-list/…`
      green.
- [x] 10.3 `pnpm lint` clean.
