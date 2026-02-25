import { readFileSync } from "fs";
import type { CustomProjectConfig } from "lost-pixel";

/**
 * Lost Pixel OSS — Visual Regression POC
 *
 * Reads Storybook v10's index.json directly to discover all stories,
 * since Lost Pixel doesn't yet support the v5 index format natively.
 *
 * Run workflow:
 *   1. pnpm vr:build    — build storybook static output (once)
 *   2. pnpm vr:serve    — serve at localhost:6006 (keep running)
 *   3. pnpm vr:update   — capture baselines for all stories
 *   4. pnpm vr:test     — compare against baselines
 */
const index = JSON.parse(
  readFileSync("./packages/nimbus/storybook-static/index.json", "utf-8")
);

const pages = Object.values(index.entries)
  .filter((entry: any) => entry.type === "story")
  .map((entry: any) => ({
    path: `/iframe.html?id=${entry.id}&viewMode=story`,
    name: entry.id,
  }));

export const config: CustomProjectConfig = {
  pageShots: {
    baseUrl: "http://localhost:6006",
    pages,
  },
  // OSS mode — no platform upload, no auth required
  generateOnly: true,
  failOnDifference: true,
  threshold: 0,
};
