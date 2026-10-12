import { defineConfig } from "vitest/config";

/**
 * Tool evals: spawns the built server (dist/index.js) over stdio and runs
 * every case in evals/cases/*.json. Requires a prior build, so this project
 * is intentionally not registered in the root vitest.config.mts.
 *
 * Run with: pnpm --filter @commercetools/nimbus-mcp eval
 */
export default defineConfig({
  test: {
    name: "nimbus-mcp-evals",
    include: ["evals/**/*.eval.spec.ts"],
    environment: "node",
    testTimeout: 30_000,
    hookTimeout: 30_000,
  },
});
