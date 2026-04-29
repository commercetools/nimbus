---
"@commercetools/nimbus": minor
---

`Avatar`: harden against missing/edge-case `firstName` and `lastName` values.

- `firstName` and `lastName` are now **optional** props. Existing call sites
  passing both still type-check; new call sites can omit either or both.
- When neither name yields a usable initial after trimming, the component
  renders the `Person` icon from `@commercetools/nimbus-icons` as a visual
  fallback (instead of crashing or rendering nothing).
- Initials extraction is now Unicode codepoint-safe (emoji and astral-plane
  characters are no longer split mid-surrogate) and trim-aware (leading and
  trailing whitespace is discarded before extracting the first character).
- New i18n key `avatarLabelGeneric` (default English: "User avatar") used as the
  `aria-label` and default `alt` when no name is available.
- Side fix to the i18n dictionary generation script: previously, message keys
  following an interpolated message (one using `${args.foo}`) were silently
  dropped from the generated `*MessageKey` union type. This restored 2 missing
  keys for `Pagination` (`page`, `pagination`) as an incidental fix.
