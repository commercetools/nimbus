---
"@commercetools/nimbus": minor
"@commercetools/nimbus-icons": minor
---

Package-shape correctness fixes for strict TypeScript and native Node ESM
consumers. Bundler-based consumers (Vite, Webpack, Next.js) see no change.

### `@commercetools/nimbus`

- `./setup-jsdom-polyfills` now ships type declarations. Consumers using the
  documented `setupFiles: ['@commercetools/nimbus/setup-jsdom-polyfills']`
  config in Jest or Vitest get autocomplete and signature checking.
- CJS consumers via `require()` (Jest in JSDOM, classic Next.js pages dir)
  receive correctly-typed declarations. Previously the same `.d.ts` was served
  for both ESM and CJS paths, producing subtle type mismatches.
- Type-checking under `moduleResolution: "nodenext"` or `"node16"` no longer
  fails on internal Nimbus imports.

### `@commercetools/nimbus-icons`

- Now importable from native Node ESM (e.g., Node 22+ with `"type": "module"`,
  certain SSR setups that externalize `node_modules`). Previously the ESM build
  failed at parse time outside a bundler.
