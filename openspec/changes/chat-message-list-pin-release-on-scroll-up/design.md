## Context

`useStickToBottom` (`chat-message-list/hooks/use-stick-to-bottom.ts`) holds a
`pinned` flag. Two paths use it:

- A scroll handler on the viewport derives `pinned` from the distance to the
  bottom: `pinned = distance <= 32px`.
- A `ResizeObserver` (content flow and viewport) and a `MutationObserver`
  schedule a "stick" (`scrollTop = scrollHeight`) only while `pinned` is true.

In a browser frame, scroll events are dispatched before `ResizeObserver`
callbacks (HTML "update the rendering" steps). So when the last item grows
after the stick but before its scroll event is dispatched, the scroll handler
reads the post-growth distance, sets `pinned = false`, and the
`ResizeObserver` callback that follows no longer sticks. See proposal.md for
the user-facing effect.

## Goals / Non-Goals

**Goals:**

- Release the pin only on an upward scroll, as required by the modified spec.
- Keep all other behavior: the smooth-scroll guard for the jump control,
  re-pinning at the bottom, `autoScroll={false}` reporting.

**Non-Goals:**

- No change to the threshold, the coalescing of sticks, or the observers.
- No public API change.

## Decisions

### Detect an upward scroll by comparing `scrollTop` between scroll events

The handler stores the previous `scrollTop`. `movedUp = scrollTop < previous`.
While auto-scroll is on and the list is pinned, a scroll event that is not at
the bottom and did not move up is ignored (the pin stays). Growth below the
visible area raises `scrollHeight` but never lowers `scrollTop`, so it can no
longer release the pin. A user scrolling up always lowers `scrollTop`.

Alternatives considered:

- **Ignore the next scroll event after each stick.** Fragile: the number of
  scroll events per stick is not fixed (a no-op `scrollTop` write fires none),
  and a real user scroll could be swallowed.
- **Re-check the distance in the next frame (`requestAnimationFrame`).** Adds
  latency to every release, and frames are throttled in background tabs, which
  the hook already avoids for sticks (it uses a microtask).
- **Listen to `wheel` / `touchmove` / keys to detect user intent.** Misses
  scrollbar dragging and assistive-technology scrolling; more listeners.

### Apply the rule only while auto-scroll is on and pinned

With `autoScroll={false}` nothing sticks, so `isPinned` keeps reporting the
real position (it drives the jump control). When not pinned, the normal
`pinned = atBottom` path re-engages the pin when the user reaches the bottom.

## Risks / Trade-offs

- [A programmatic upward scroll by the consumer (e.g. `scrollTop = 0`) releases
  the pin] → Expected: it is an upward move, same as before this change.
- [The viewport shrinks while pinned, the distance grows without a scroll
  event] → No scroll event means no release, and the `ResizeObserver` on the
  viewport sticks again. Same as before.
- [The existing story only fails on slow runners, so it does not guard the fix
  reliably] → Tracked as an optional task: a story that forces the event order.

## Migration Plan

Patch release; no consumer action. Rollback is reverting the hook change.
