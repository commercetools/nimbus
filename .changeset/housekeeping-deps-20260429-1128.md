---
"@commercetools/nimbus": patch
---

The `pauseOnInteraction` option on `ToastOptions` has been removed. The field
had no effect at runtime — pause-on-hover and pause-on-focus are always on — but
if your code passed it explicitly, TypeScript will now flag it. Drop the prop;
toast behavior is unchanged.

Peer dependency: this release requires `@chakra-ui/react` `^3.35.0`. Bump
alongside if you pin Chakra in your project.

Also bundles the `dompurify` 3.4.1 patch release (transparent to consumers) and
corrects the TypeScript type for `aspectRatios` theme tokens (now
`string | number`; relevant only if you import these tokens directly with strict
types).
