import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "nimbus-mcp",
    // Harness unit tests under evals/ run here, build-free. The eval run
    // itself (*.eval.spec.ts) needs dist/ and lives in vitest.evals.config.ts.
    include: ["src/**/*.spec.ts", "evals/**/*.spec.ts"],
    exclude: [...configDefaults.exclude, "evals/**/*.eval.spec.ts"],
    environment: "node",
  },
});
