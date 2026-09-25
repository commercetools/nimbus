## 1. Implementation

- [x] 1.1 In `use-stick-to-bottom.ts`, track the viewport's `scrollTop` between
      scroll events and derive `movedUp`
- [x] 1.2 While auto-scroll is on and pinned, ignore a scroll event that is not
      at the bottom and did not move up (keep the pin)
- [x] 1.3 Keep `autoScroll={false}` reporting and the smooth-scroll guard
      unchanged

## 2. Release note and docs

- [x] 2.1 Add a patch changeset for `@commercetools/nimbus`
      (`.changeset/chat-message-list-keeps-pin-on-growth.md`)
- [x] 2.2 Check the component docs: `chat-message-list.mdx` and
      `chat-message-list.dev.mdx` already say only scrolling up releases the
      pin; no change needed

## 3. Verification

- [x] 3.1 With the event order forced (scroll handled after growth, before
      `ResizeObserver`), "Empty Start Follows Growth" fails without the fix and
      all 12 ChatMessageList stories pass with it
- [x] 3.2 Lint, Prettier, `typecheck:dev` and ChatMessageList unit tests pass
- [x] 3.3 Full `pnpm test:storybook` passes against the built package
- [x] 3.4 Validate this change with `pnpm openspec validate --strict`

## 4. Optional follow-up

- [ ] 4.1 Add a story that forces the event order, so the regression fails on
      every runner (deferred: not requested for this change)
