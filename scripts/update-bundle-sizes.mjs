#!/usr/bin/env node
/* global console, process, URL */

/**
 * Updates bundle-sizes.json with current measured sizes.
 *
 * Run this from your PR branch when CI reports a bundle size increase
 * that you want to approve:
 *
 *   node scripts/update-bundle-sizes.mjs
 *
 * This will:
 *   1. Measure minified output sizes for each tracked package
 *   2. Write the results to bundle-sizes.json at the repo root
 *   3. You commit and push — CI re-runs and passes
 */

import {
  readFileSync,
  writeFileSync,
  readdirSync,
  existsSync,
  statSync,
} from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const BASELINE_PATH = join(ROOT, "bundle-sizes.json");

// Same package definitions as check-bundle-size.mjs
const PACKAGES = {
  "@commercetools/nimbus": {
    dist: join(ROOT, "packages/nimbus/dist"),
    formats: {
      esm: { pattern: "**/*.es.js" },
      cjs: { pattern: "**/*.cjs" },
    },
  },
  "@commercetools/nimbus-icons": {
    dist: join(ROOT, "packages/nimbus-icons/dist"),
    formats: {
      esm: { dir: "esm" },
      cjs: { dir: "cjs" },
    },
  },
  "@commercetools/nimbus-tokens": {
    dist: join(ROOT, "packages/tokens/dist"),
    formats: {
      esm: { pattern: "*.esm.js" },
      cjs: { pattern: "*.cjs.js" },
    },
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

function formatDelta(current, baseline) {
  if (baseline === 0) return "new";
  const pct = ((current - baseline) / baseline) * 100;
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct.toFixed(1)}%`;
}

function padEnd(str, len) {
  return str.length >= len ? str : str + " ".repeat(len - str.length);
}

function padStart(str, len) {
  return str.length >= len ? str : " ".repeat(len - str.length) + str;
}

function sumFileSize(dir, filterFn) {
  let total = 0;
  if (!existsSync(dir)) return total;

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      total += sumFileSize(fullPath, filterFn);
    } else if (!filterFn || filterFn(entry.name)) {
      total += statSync(fullPath).size;
    }
  }
  return total;
}

function sumByPattern(dir, pattern) {
  if (pattern.startsWith("**/")) {
    const ext = pattern.slice(3);
    const suffix = ext.startsWith("*") ? ext.slice(1) : ext;
    return sumFileSize(dir, (name) => name.endsWith(suffix));
  }
  const suffix = pattern.startsWith("*") ? pattern.slice(1) : pattern;
  return sumFileSize(dir, (name) => name.endsWith(suffix));
}

// ---------------------------------------------------------------------------
// Measure packages
// ---------------------------------------------------------------------------

function measurePackages() {
  const sizes = {};

  for (const [pkgName, config] of Object.entries(PACKAGES)) {
    if (!existsSync(config.dist)) {
      console.warn(`Warning: dist not found for ${pkgName} at ${config.dist}`);
      continue;
    }

    sizes[pkgName] = {};

    for (const [format, spec] of Object.entries(config.formats)) {
      if (spec.dir) {
        sizes[pkgName][format] = sumFileSize(
          join(config.dist, spec.dir),
          (name) => name.endsWith(".js")
        );
      } else if (spec.pattern) {
        sizes[pkgName][format] = sumByPattern(config.dist, spec.pattern);
      }
    }
  }

  return sizes;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const anyDistExists = Object.values(PACKAGES).some((config) =>
  existsSync(config.dist)
);
if (!anyDistExists) {
  console.error("No dist directories found.\nRun `pnpm build:packages` first.");
  process.exit(1);
}

const sizes = measurePackages();

// Load old baseline for comparison (if it exists)
let oldBaseline = null;
if (existsSync(BASELINE_PATH)) {
  try {
    oldBaseline = JSON.parse(readFileSync(BASELINE_PATH, "utf-8"));
  } catch {
    // ignore parse errors
  }
}

// Write new baseline
writeFileSync(BASELINE_PATH, JSON.stringify(sizes, null, 2) + "\n");

// Print summary
console.log(`\nBundle sizes updated at ${BASELINE_PATH}\n`);
console.log(
  padEnd("Package", 40) +
    padStart("Format", 8) +
    padStart("Size", 12) +
    (oldBaseline ? padStart("Previous", 12) + padStart("Delta", 10) : "")
);
console.log("-".repeat(oldBaseline ? 82 : 60));

for (const [pkgName, formats] of Object.entries(sizes)) {
  for (const [format, size] of Object.entries(formats)) {
    let line =
      padEnd(pkgName, 40) +
      padStart(format, 8) +
      padStart(formatBytes(size), 12);

    if (oldBaseline) {
      const oldSize = oldBaseline[pkgName]?.[format];
      if (oldSize != null) {
        line +=
          padStart(formatBytes(oldSize), 12) +
          padStart(formatDelta(size, oldSize), 10);
      } else {
        line += padStart("-", 12) + padStart("new", 10);
      }
    }

    console.log(line);
  }
}

console.log();
console.log("Next steps:");
console.log("  1. Review the changes: git diff bundle-sizes.json");
console.log("  2. Commit: git add bundle-sizes.json && git commit");
console.log("  3. Push your branch — CI will re-run and pass");
console.log();
