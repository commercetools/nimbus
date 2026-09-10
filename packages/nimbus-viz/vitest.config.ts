import { defineConfig } from "vitest/config";

// Local orchestrator so `pnpm --filter @commercetools/nimbus-viz test` runs both
// projects, mirroring packages/nimbus/vitest.config.ts. The repo root
// (vitest.config.mts / vitest.dev.config.mts) references the two project files
// directly instead of this file.
export default defineConfig({
  test: {
    projects: ["./vitest.unit.config.ts", "./vitest.storybook.config.ts"],
  },
});
