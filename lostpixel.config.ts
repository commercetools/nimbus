import type { CustomProjectConfig } from "lost-pixel";

/**
 * Lost Pixel OSS — Visual Regression POC
 *
 * 4 controlled stories used as comparison targets.
 * Run workflow:
 *   1. pnpm vr:build    — build storybook static output (once)
 *   2. pnpm vr:serve    — serve it at localhost:6006 (keep running)
 *   3. pnpm vr:update   — capture baselines (first time, or after intentional changes)
 *   4. pnpm vr:test     — compare against baselines
 */
export const config: CustomProjectConfig = {
  pageShots: {
    baseUrl: "http://localhost:6006",
    pages: [
      {
        path: "/iframe.html?id=components-progressbar--base&viewMode=story",
        name: "progress-bar--base",
      },
    ],
  },
  // OSS mode — no platform upload, no auth required
  generateOnly: true,
  failOnDifference: true,
  threshold: 0,
};
