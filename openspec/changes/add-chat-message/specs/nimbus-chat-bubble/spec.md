# Specification: ChatBubble (removed)

This change supersedes the `nimbus-chat-bubble` capability. `ChatBubble` is
renamed and reshaped into `ChatMessage` (see the `nimbus-chat-message`
capability added by this same change): the compound namespace becomes
`ChatMessage`, `.Footer` becomes `.Meta`, the `sender` axis narrows to
`user | agent` (with `system` removed — not replaced by a standardized component
(out of scope; consumer-rendered) — and `tool` output becoming agent content),
and streamed-text rendering is delegated to the
`Markdown` component. All `nimbus-chat-bubble` requirements are removed and
re-expressed under `nimbus-chat-message`.

## REMOVED Requirements

### Requirement: Compound message layout

**Reason:** Renamed to `ChatMessage` (`.Footer` → `.Meta`); re-expressed under
`nimbus-chat-message` → "Compound message layout".

### Requirement: Sender variants

**Reason:** `sender` narrowed to `user | agent`; re-expressed under
`nimbus-chat-message` → "Sender variants (user and agent)". `system` is removed
and not replaced by a standardized component (out of scope; consumer-rendered);
`tool` becomes agent content.

### Requirement: Status tone

**Reason:** Unchanged in behavior; re-expressed under `nimbus-chat-message` →
"Status tone".

### Requirement: Avatar

**Reason:** Unchanged in behavior; re-expressed under `nimbus-chat-message` →
"Avatar".

### Requirement: Streaming affordance

**Reason:** Reshaped — streamed-text rendering is delegated to `Markdown`;
re-expressed under `nimbus-chat-message` → "Streaming affordance delegates
rendering to Markdown".

### Requirement: Accessibility (WCAG 2.1 AA) with consumer-composed feed

**Reason:** Unchanged in behavior; re-expressed under `nimbus-chat-message` →
"Accessibility (WCAG 2.1 AA) with consumer-composed feed". The documented-feed
scenario is superseded by the `nimbus-chat-message-list` capability.

### Requirement: Component registration and theming

**Reason:** Recipe key `nimbusChatBubble` → `nimbusChatMessage` and barrel
export renamed; re-expressed under `nimbus-chat-message` → "Component
registration and theming".
