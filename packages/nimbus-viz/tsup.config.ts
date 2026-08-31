import { defineConfig } from "tsup";

export default defineConfig({
  // Single barrel entry. `sideEffects: false` (package.json) lets consumers
  // tree-shake unused charts from named imports. Per-chart subpath entries were
  // trialed but the 47-entry DTS rollup blows past an 8GB heap and keeps
  // growing — deferred pending a memory-safe declaration strategy.
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  target: "es2020",
  external: ["react", "react-dom"],
});
