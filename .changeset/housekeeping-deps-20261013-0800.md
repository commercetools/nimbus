---
"@commercetools/nimbus": patch
---

Update dependencies: `@chakra-ui/cli` to `^3.37.0` and `remend` to `^1.4.0`.

Peer dependency: this release requires `@chakra-ui/react` `^3.37.0` (previously
`^3.36.1`). Bump alongside if you pin Chakra in your project. Chakra 3.37.0
brings `@ark-ui/react` 5.39.0 and Zag.js 1.43.3 (toast and scroll-area), so
toast and scroll behavior follows those versions.

Also adjusts the internal toaster types so Nimbus builds against Chakra 3.37.0.
There is no change to the public `toast()` API.
