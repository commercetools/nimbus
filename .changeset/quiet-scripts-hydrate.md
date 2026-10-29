---
"@commercetools/nimbus": patch
---

`NimbusProvider`: no longer triggers React 19.3's "Encountered a script tag
while rendering React component" console error when it renders in the browser.
Tests that fail on `console.error` now pass with React 19.3, including those
that render Nimbus components wrapped in their own `NimbusProvider`.

On the server, the theme script is still output as executable JavaScript, so
server-rendered pages keep setting the correct theme before first paint. A
`type` passed in `scriptProps` is still used as given.

`NimbusProvider`: can now be rendered on the server (for example with
`renderToString`). Before, it threw "Missing getServerSnapshot" while rendering
the toast outlet.
