import { copyDocsData } from "./copy-docs-data.js";
import { buildTokenData } from "./build-token-data.js";
import { buildIconCatalog } from "./build-icon-catalog.js";

const steps = [
  { name: "Copy docs data", fn: copyDocsData },
  { name: "Build token data", fn: buildTokenData },
  { name: "Build icon catalog", fn: buildIconCatalog },
];

for (const step of steps) {
  const start = performance.now();
  console.log(`[prebuild] ${step.name}...`);
  try {
    await step.fn();
    const ms = (performance.now() - start).toFixed(0);
    console.log(`[prebuild] ${step.name} done (${ms}ms)`);
  } catch (err) {
    console.error(`[prebuild] ${step.name} failed:`, err);
    process.exit(1);
  }
}
