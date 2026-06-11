# Bundler Plugins — Optional Dependency Resolution

Nimbus ships webpack and Vite plugins that let build tools treat
`@commercetools/nimbus` as an optional dependency. When Nimbus **is** installed,
the plugins are no-ops. When it **is not** installed, they replace every Nimbus
import with an empty stub so the build completes without errors and zero Nimbus
code lands in the bundle.

## When to use

Use these plugins in **shared build tooling** (e.g. `mc-scripts`) that produces
bundles for applications that may or may not depend on Nimbus. Without the
plugins, any `import … from '@commercetools/nimbus'` in shared code would cause
a build failure for apps that haven't installed Nimbus.

## Entry points

| Entry point                             | Format    | Export                           |
| --------------------------------------- | --------- | -------------------------------- |
| `@commercetools/nimbus/plugins/webpack` | CJS + ESM | `NimbusOptionalDependencyPlugin` |
| `@commercetools/nimbus/plugins/vite`    | CJS + ESM | `nimbusOptionalDependency`       |
| `@commercetools/nimbus/plugins/stub`    | CJS + ESM | _(empty module)_                 |

All entry points are standalone — they do **not** import the Nimbus runtime and
can be loaded without triggering React, Chakra UI, or any other Nimbus
dependency.

## Webpack

```js
// webpack.config.js
const {
  NimbusOptionalDependencyPlugin,
} = require("@commercetools/nimbus/plugins/webpack");

module.exports = {
  plugins: [new NimbusOptionalDependencyPlugin()],
};
```

Under the hood the plugin accesses webpack's built-in
`NormalModuleReplacementPlugin` via `compiler.webpack` (webpack 5+). It replaces
any import matching `@commercetools/nimbus` or its subpaths (except
`/plugins/*`) with `@commercetools/nimbus/plugins/stub`.

## Vite

```ts
// vite.config.ts
import { nimbusOptionalDependency } from "@commercetools/nimbus/plugins/vite";

export default defineConfig({
  plugins: [nimbusOptionalDependency()],
});
```

The Vite plugin uses `resolveId` and `load` hooks to redirect matching imports
to a virtual stub module (`export default {}`). No physical file is written to
disk.

## How detection works

At plugin initialization (build startup), the plugin calls:

```js
require.resolve("@commercetools/nimbus", { paths: [process.cwd()] });
```

- **Resolves** → Nimbus is installed from the perspective of the consuming app.
  The plugin becomes a **no-op**.
- **Throws** → Nimbus is not installed. The plugin activates and stubs all
  matching imports.

The `{ paths: [process.cwd()] }` option ensures the check runs from the
**application root**, not from the plugin's own `node_modules` location. This is
important in monorepo setups where the build tool may have Nimbus as a
dependency while the application being built does not.

## What gets stubbed

The regex `/^@commercetools\/nimbus(?:$|\/(?!plugins\/))/` matches:

| Import                                        | Stubbed? |
| --------------------------------------------- | -------- |
| `@commercetools/nimbus`                       | Yes      |
| `@commercetools/nimbus/components/Button`     | Yes      |
| `@commercetools/nimbus/setup-jsdom-polyfills` | Yes      |
| `@commercetools/nimbus/plugins/webpack`       | **No**   |
| `@commercetools/nimbus/plugins/vite`          | **No**   |
| `@commercetools/nimbus/plugins/stub`          | **No**   |
| `@commercetools/nimbus-icons`                 | **No**   |
| `@commercetools/nimbus-tokens`                | **No**   |

The `/plugins/*` subpaths are excluded so the plugins and stub can resolve
themselves without circular replacement.

## Extending the pattern

The mechanism is reusable for any optional dependency. To adapt it for a
different package, change the regex and the `require.resolve` target in
`is-nimbus-resolvable.ts`.
