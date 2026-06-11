# FEC-1015: Ship bundler plugins for build-time optional-dependency resolution

## Summary

Ship webpack and Vite bundler plugins from `@commercetools/nimbus` that detect
whether Nimbus is installed and stub out imports when absent. The plugins are
dedicated entry points that do not pull in Nimbus runtime.

## Tasks

### 1. Create plugin source files

- `src/plugins/is-nimbus-resolvable.ts` — Shared utility that checks
  `require.resolve('@commercetools/nimbus', { paths: [process.cwd()] })`
- `src/plugins/webpack.ts` — Webpack plugin using
  `NormalModuleReplacementPlugin`
- `src/plugins/vite.ts` — Vite plugin using `resolveId` + `load` hooks
- `src/plugins/stub.ts` — Empty stub module (`export {}`)

### 2. Write unit tests

- `src/plugins/is-nimbus-resolvable.spec.ts`
- `src/plugins/webpack.spec.ts`
- `src/plugins/vite.spec.ts`

### 3. Update build configuration

- `package.json` — Add exports for `./plugins/webpack`, `./plugins/vite`,
  `./plugins/stub`; update `typesVersions`
- `vite.config.ts` — Add plugin entries; update `fileName` to route plugins to
  `plugins/` dir
- `scripts/postbuild-types.mjs` — Add plugin entry points to `.d.cts`
  duplication step

### 4. Add documentation

- Create developer documentation for the plugins

### 5. Verify

- Run unit tests
- Run build
- Run `pnpm check:package-shape` to validate exports

## Design decisions

- **Regex**: `/^@commercetools\/nimbus(?:$|\/(?!plugins\/))/` — matches all
  Nimbus runtime imports but excludes the `plugins/*` subpaths
- **Detection**: `require.resolve` with `{ paths: [process.cwd()] }` to check
  from the consuming app's perspective, not the plugin's location
- **Webpack stub**: Redirects to `@commercetools/nimbus/plugins/stub` (the stub
  entry point), so webpack resolves it through its normal module resolution
- **Vite stub**: Uses a virtual module (`\0nimbus-stub`) for cleaner resolution
- **No runtime deps on webpack/vite**: The webpack plugin accesses
  `NormalModuleReplacementPlugin` via `compiler.webpack`; the Vite plugin only
  uses the Plugin interface shape
