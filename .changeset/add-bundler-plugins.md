---
"@commercetools/nimbus": minor
---

New bundler plugins for optional-dependency resolution. Webpack
(`UNSAFE_NimbusOptionalDependencyPlugin`) and Vite
(`UNSAFE_nimbusOptionalDependency`) plugins detect whether Nimbus is installed
at build time and stub out imports when absent, allowing shared build tooling to
support applications that may or may not depend on Nimbus.

Available at `@commercetools/nimbus/plugins/webpack` and
`@commercetools/nimbus/plugins/vite`.
