## Why

`ChatMessageList` can stop following the newest message although the user never
scrolled up. When the last item grows without a text change (for example, an
image finishes loading) in the same frame as the list's own scroll to the
bottom, the pin is released and the growth stays unfollowed. This shows up as a
flaky story test in CI ("Empty Start Follows Growth" failing with
`expected 360 to be less than or equal to 33` on `main` and on other branches)
and as a real bug for users on slow devices.

The current spec says the pin is released "when the user scrolls up beyond the
threshold", but it does not say what must happen when the distance to the bottom
grows for another reason. This change makes that explicit.

## What Changes

- The stick-to-bottom pin is released only by an upward scroll (the viewport's
  scroll position moves up). A larger distance to the bottom caused by content
  growth or a viewport size change no longer releases the pin.
- While pinned, growth of the last item without a text change is followed, even
  when it happens in the same frame as the list's own scroll to the bottom.
- No change when `autoScroll` is `false`: the list keeps reporting the real
  position and does not pin automatically.
- No API change. Patch release with a changeset.

## Capabilities

### New Capabilities

<!-- none -->

### Modified Capabilities

- `nimbus-chat-message-list`: the "Autoscroll and stick-to-bottom" requirement
  now states that only an upward user scroll releases the pin, with scenarios
  for growth that happens while pinned.

## Impact

- Code: `packages/nimbus/src/components/chat-message-list/hooks/use-stick-to-bottom.ts`
  (scroll-position tracking in the scroll handler).
- Tests: the existing story "Empty Start Follows Growth" in
  `chat-message-list.stories.tsx` covers the behavior; it only fails on slow
  runners, so it is not a reliable regression guard on its own.
- Consumers: `ChatMessageList` behaves as documented in more timing cases. No
  API, type or styling change. Release note in
  `.changeset/chat-message-list-keeps-pin-on-growth.md`.
