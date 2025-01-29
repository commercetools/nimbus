import { defineProject } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineProject({
  plugins: [react()],
  test: {
    environment: "jsdom",
    /* browser: {
      enabled: true,
      provider: "playwright",
      instances: [{ browser: "chromium" }],
    }, */
  },
});
