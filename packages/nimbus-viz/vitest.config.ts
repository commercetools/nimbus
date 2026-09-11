import { defineConfig } from "vitest/config";

// Runs both viz test projects for `pnpm --filter @commercetools/nimbus-viz test`.
export default defineConfig({
  test: {
    projects: ["./vitest.unit.config.ts", "./vitest.storybook.config.ts"],
  },
});
