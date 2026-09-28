## MODIFIED Requirements

### Requirement: Autoscroll and stick-to-bottom

`ChatMessageList.Root` SHALL keep the viewport pinned to the newest item while
the user is at (or within a small threshold of) the bottom, including while an
agent reply streams and grows, and SHALL release the pin when the user scrolls
up beyond the threshold. Only an upward scroll of the viewport SHALL release the
pin: a larger distance to the bottom caused by content growth or a change of the
viewport size SHALL NOT release it.

#### Scenario: Pin to newest on append

- **WHEN** the user is at the bottom and a new item is appended (or the last
  item grows during streaming)
- **THEN** SHALL keep the newest content in view
- **AND** SHALL respect `prefers-reduced-motion` when scrolling

#### Scenario: Follow growth without a text change while pinned

- **WHEN** the list is pinned and the last item grows without any text or
  child change (for example, an image finishes loading or its height changes
  through styling)
- **THEN** SHALL keep the newest content in view
- **AND** SHALL NOT show the scroll-to-bottom affordance

#### Scenario: Growth in the same frame as the list's own scroll

- **WHEN** new items are appended, the list scrolls itself to the bottom, and
  the last item grows before the browser reports that scroll
- **THEN** SHALL stay pinned and keep the newest content in view
- **AND** SHALL NOT treat the reported distance to the bottom as a user scroll

#### Scenario: Release on scroll-up

- **WHEN** the user scrolls up beyond the threshold to read history
- **THEN** SHALL stop pinning so incoming content does not interrupt reading

#### Scenario: Autoscroll can be disabled and driven imperatively

- **WHEN** `autoScroll` is set to `false`
- **THEN** SHALL not pin to the bottom automatically
- **AND** SHALL expose an imperative `scrollToBottom()` via `ref`
- **AND** on each scroll SHALL report the pinned state from the real distance
  to the bottom, without the upward-scroll rule above
