/**
 * Writes the chart color tokens and the chart palette module.
 *
 * Run from `packages/color-tokens`:
 *
 *   pnpm generate:chart-tokens
 *
 * Outputs (both committed):
 * - `packages/tokens/src/base/chart-tokens.json`: the color tokens. Rebuild the
 *   tokens afterwards (`pnpm build:tokens`).
 * - `packages/nimbus/src/components/chart/chart.palettes.ts`: the `ChartPalette`
 *   type and the default palette order.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import {
  generateChartPalettesModule,
  generateChartTokens,
  serializeChartTokens,
} from "./chart-colors";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const write = (relativeTarget: string, content: string) => {
  const target = path.resolve(__dirname, relativeTarget);
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, content, "utf-8");
  console.log(`Wrote ${path.relative(process.cwd(), target)}`);
};

write(
  "../tokens/src/base/chart-tokens.json",
  serializeChartTokens(generateChartTokens())
);
write(
  "../nimbus/src/components/chart/chart.palettes.ts",
  generateChartPalettesModule()
);
