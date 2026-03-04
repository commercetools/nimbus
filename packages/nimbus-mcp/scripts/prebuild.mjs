import { copyDocsData } from "./copy-docs-data.mjs";

const steps = [{ name: "Copy docs data", fn: copyDocsData }];

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
