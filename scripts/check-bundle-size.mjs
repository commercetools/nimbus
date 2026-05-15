#!/usr/bin/env node

/**
 * Bundle size check script for Nimbus.
 *
 * Measures minified (not gzipped) sizes of built package output and compares
 * against a baseline committed to the repo (bundle-sizes.json). In CI, the
 * baseline from the main branch is fetched via git to compare against the PR's
 * measured sizes. If the PR's own bundle-sizes.json has been updated to match
 * current sizes, the check treats the increase as approved and passes.
 *
 * Usage:
 *   node scripts/check-bundle-size.mjs   # compare against main's baseline
 *
 * The approval flow:
 *   1. CI fails because a package exceeds the 5% threshold
 *   2. Developer runs: node scripts/update-bundle-sizes.mjs
 *   3. Developer commits the updated bundle-sizes.json
 *   4. CI re-runs — PR baseline matches measured sizes — passes
 */

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const BASELINE_PATH = join(ROOT, "bundle-sizes.json");

// Default threshold (percentage increase over baseline)
const DEFAULT_THRESHOLD = 0.05; // 5%

// Per-package size policies:
//   { kind: "relative", threshold }  — fail if increase exceeds threshold (default)
//   { kind: "absolute", maxBytes }   — fail if measured size exceeds maxBytes
const PACKAGES = {
  "@commercetools/nimbus": {
    dist: join(ROOT, "packages/nimbus/dist"),
  },
  "@commercetools/nimbus-icons": {
    dist: join(ROOT, "packages/nimbus-icons/dist"),
  },
  "@commercetools/nimbus-tokens": {
    dist: join(ROOT, "packages/tokens/dist"),
    policy: { kind: "absolute", maxBytes: 512000 },
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatBytes(bytes) {
  const kb = bytes / 1024;
  return `${kb.toFixed(1)} KB`;
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

function sumFileSize(dir) {
  let total = 0;
  if (!existsSync(dir)) return total;

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      total += sumFileSize(fullPath);
    } else {
      total += statSync(fullPath).size;
    }
  }
  return total;
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

    sizes[pkgName] = { dist: sumFileSize(config.dist) };
  }

  return sizes;
}

// ---------------------------------------------------------------------------
// Fetch baseline from main branch via git
// ---------------------------------------------------------------------------

function fetchMainBaseline() {
  // Try origin/main first (works in CI shallow clones), then local main
  for (const ref of ["origin/main", "main"]) {
    try {
      const content = execSync(`git show ${ref}:bundle-sizes.json`, {
        encoding: "utf-8",
        cwd: ROOT,
        stdio: ["pipe", "pipe", "pipe"],
      });
      return JSON.parse(content);
    } catch {
      // try next ref
    }
  }

  console.warn(
    "Could not fetch bundle-sizes.json from main branch.\n" +
      "  This is expected on the initial setup or if main has no baseline yet.\n" +
      "  Falling back to local bundle-sizes.json.\n"
  );
  return null;
}

function loadLocalBaseline() {
  if (!existsSync(BASELINE_PATH)) {
    return null;
  }
  return JSON.parse(readFileSync(BASELINE_PATH, "utf-8"));
}

// ---------------------------------------------------------------------------
// Compare against baseline
// ---------------------------------------------------------------------------

function compare(currentSizes) {
  // Try main branch first, fall back to local
  const mainBaseline = fetchMainBaseline();
  const localBaseline = loadLocalBaseline();
  const baseline = mainBaseline || localBaseline;

  if (!baseline) {
    console.error(
      "No baseline found. Run `node scripts/update-bundle-sizes.mjs` to create one."
    );
    process.exit(1);
  }

  const baselineSource = mainBaseline ? "main branch" : "local file";
  let hasFailures = false;
  const rows = [];

  // Compare each package/format
  for (const [pkgName, formats] of Object.entries(currentSizes)) {
    const baselinePkg = baseline[pkgName];
    const pkgConfig = PACKAGES[pkgName];
    const policy = pkgConfig?.policy ?? {
      kind: "relative",
      threshold: DEFAULT_THRESHOLD,
    };

    for (const [format, currentSize] of Object.entries(formats)) {
      const baselineSize = baselinePkg?.[format];

      if (baselineSize == null) {
        rows.push({
          pkg: pkgName,
          format,
          currentSize,
          baselineSize: null,
          status: "new",
        });
        continue;
      }

      let status = "ok";

      if (policy.kind === "absolute") {
        if (currentSize > policy.maxBytes) {
          status = "fail";
          hasFailures = true;
        }
      } else {
        const threshold = policy.threshold ?? DEFAULT_THRESHOLD;
        const increase = (currentSize - baselineSize) / baselineSize;

        if (increase > threshold) {
          // Check if the PR's local baseline has been updated to approve this
          const localPkg = localBaseline?.[pkgName];
          const localSize = localPkg?.[format];

          if (
            localSize != null &&
            Math.abs(localSize - currentSize) / Math.max(currentSize, 1) < 0.001
          ) {
            status = "approved";
          } else {
            status = "fail";
            hasFailures = true;
          }
        }
      }

      rows.push({
        pkg: pkgName,
        format,
        currentSize,
        baselineSize,
        status,
      });
    }
  }

  // Check for packages removed since baseline
  for (const [pkgName, formats] of Object.entries(baseline)) {
    if (!(pkgName in currentSizes)) {
      for (const [format, baselineSize] of Object.entries(formats)) {
        rows.push({
          pkg: pkgName,
          format,
          currentSize: null,
          baselineSize,
          status: "removed",
        });
      }
    }
  }

  // Sort: failures first, then approved, then rest by size descending
  const statusOrder = { fail: 0, approved: 1, new: 2, removed: 3, ok: 4 };
  rows.sort((a, b) => {
    const so = statusOrder[a.status] - statusOrder[b.status];
    if (so !== 0) return so;
    return (b.currentSize ?? 0) - (a.currentSize ?? 0);
  });

  // Print table
  const STATUS_ICONS = {
    ok: "  ",
    fail: "X ",
    approved: "~ ",
    new: "+ ",
    removed: "- ",
  };

  console.log(`\nBundle Size Report (baseline from ${baselineSource})\n`);
  console.log(
    padEnd("Package", 40) +
      padStart("Format", 8) +
      padStart("Current", 12) +
      padStart("Baseline", 12) +
      padStart("Delta", 10) +
      "  Status"
  );
  console.log("-".repeat(88));

  for (const row of rows) {
    const current =
      row.currentSize != null ? formatBytes(row.currentSize) : "-";
    const base = row.baselineSize != null ? formatBytes(row.baselineSize) : "-";
    const delta =
      row.currentSize != null && row.baselineSize != null
        ? formatDelta(row.currentSize, row.baselineSize)
        : row.status;

    console.log(
      padEnd(row.pkg, 40) +
        padStart(row.format, 8) +
        padStart(current, 12) +
        padStart(base, 12) +
        padStart(delta, 10) +
        "  " +
        STATUS_ICONS[row.status] +
        row.status
    );
  }

  console.log("-".repeat(88));
  console.log();

  if (hasFailures) {
    const failedRows = rows.filter((r) => r.status === "fail");
    const details = failedRows
      .map((r) => {
        const pkgPolicy = PACKAGES[r.pkg]?.policy ?? {
          kind: "relative",
          threshold: DEFAULT_THRESHOLD,
        };
        if (pkgPolicy.kind === "absolute") {
          return `  ${r.pkg}.${r.format} exceeded absolute budget (${formatBytes(r.currentSize)} > ${formatBytes(pkgPolicy.maxBytes)})`;
        }
        const threshold = pkgPolicy.threshold ?? DEFAULT_THRESHOLD;
        return `  ${r.pkg}.${r.format} exceeded ${(threshold * 100).toFixed(0)}% threshold (${formatDelta(r.currentSize, r.baselineSize)})`;
      })
      .join("\n");

    console.error(
      `X FAIL: One or more packages exceeded their size budget.\n${details}\n` +
        `  If this increase is intentional, run:\n` +
        `    node scripts/update-bundle-sizes.mjs\n` +
        `  Then commit the updated bundle-sizes.json in your PR.`
    );
    process.exit(1);
  }

  const hasApproved = rows.some((r) => r.status === "approved");
  if (hasApproved) {
    console.log(
      "~ Some packages exceed the threshold but have been approved via bundle-sizes.json update.\n"
    );
  }

  console.log("OK All packages within acceptable size limits.\n");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

// Verify at least one dist directory exists
const anyDistExists = Object.values(PACKAGES).some((config) =>
  existsSync(config.dist)
);
if (!anyDistExists) {
  console.error("No dist directories found.\nRun `pnpm build:packages` first.");
  process.exit(1);
}

const sizes = measurePackages();
compare(sizes);
