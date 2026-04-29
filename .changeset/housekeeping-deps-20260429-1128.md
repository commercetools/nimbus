---
"@commercetools/nimbus": patch
---

Dependency housekeeping plus consumer-visible cleanup that surfaced from it.

**Dependency bumps**

- `@chakra-ui/react` and `@chakra-ui/cli`: ^3.34.0 → ^3.35.0 (peer + runtime).
  Brings in `@zag-js/toast` 1.40.0 transitively. Consumers tracking Chakra peers
  may want to bump in lockstep.
- `dompurify` (bundled): ^3.4.0 → ^3.4.1. Patch fixes from upstream; consumers
  pick this up transparently.

**Toast: `pauseOnInteraction` removed from `ToastOptions`**

The field was based on a misattribution of the original spec — no equivalent
option exists on Chakra, Ark, or zag. zag's group machine pauses on hover/focus
unconditionally at the region level, so the field was silently dropped at
runtime regardless of value. Removing it is a TypeScript surface change only: no
app behavior changes either way. Consumers passing `pauseOnInteraction` should
drop it; pause-on-hover/focus continues to work as before.

**Aspect-ratio theme tokens: typed correctly**

`tokens.aspectRatios` was registered against the wrong `defineTokens` bucket
(`durations`, which Chakra 3.35 narrowed to `string`). Tokens have always
resolved to numeric values at runtime — only the TypeScript type was wrong.
Consumers importing aspect-ratio tokens directly with strict types will now see
correct `string | number` typings instead of `string`.
