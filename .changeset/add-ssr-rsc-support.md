---
"@commercetools/nimbus": minor
---

All component entry points now include `"use client"` directives, enabling
Nimbus to work in React Server Component environments such as Next.js App
Router. Components can be imported directly in server component files without
triggering RSC compilation errors.

`ToastOutlet` no longer crashes during server-side rendering.
