---
"@commercetools/nimbus": minor
---

`PublicPageLayout`: New pattern for public-facing pages (login, registration,
password reset). Provides a centered, full-viewport-height layout with optional
slots for brand logo, welcome heading, content area, and legal footer. Style
props are forwarded to the outer `<main>` wrapper.

`Icon`: The `size` prop is now correctly exposed in TypeScript. Previously, the
recipe's `size` variant was accidentally stripped from the type.
