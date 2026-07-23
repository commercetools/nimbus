#!/usr/bin/env node

/**
 * Bundle size check script for Nimbus.
 *
 * Measures minified (not gzipped) sizes of built package output and compares
 * against a baseline from the comment chain (the most recently merged PR with
 * the `bundle-sizes` label).
 *
 * In CI the baseline is passed via the BUNDLE_SIZE_BASELINE env var (set by
 * fetch-bundle-baseline.mjs). When run locally without that env var, the
 * script calls fetch-bundle-baseline.mjs automatically (requires `gh` CLI).
 *
 * Flags:
 *   --json   Output machine-readable JSON instead of the human-readable table
 *
 * Environment variables:
 *   BUNDLE_SIZE_BASELINE   JSON string of baseline sizes
 *   BUNDLE_SIZE_APPROVED   Set to "true" to treat all threshold exceedances
 *                          as approved (used when bundle-size-approved label
 *                          is present on the PR)
 */

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = process.cwd();
const __dirname = dirname(fileURLToPath(import.meta.url));
const BOOTSTRAP_PATH = join(ROOT, "bundle-sizes.json");

const ENV_BASELINE = process.env.BUNDLE_SIZE_BASELINE || "";
const IS_APPROVED = process.env.BUNDLE_SIZE_APPROVED === "true";
const JSON_OUTPUT = process.argv.includes("--json");

function failWithError(message) {
  console.error(message);
  if (JSON_OUTPUT) {
    console.log(JSON.stringify({ error: message, has_failures: true }));
  }
  process.exit(1);
}

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
// Baseline resolution
// ---------------------------------------------------------------------------

function fetchBaselineFromCommentChain() {
  const fetchScript = join(__dirname, "fetch-bundle-baseline.mjs");
  try {
    const output = execSync(`node ${fetchScript}`, {
      encoding: "utf-8",
      cwd: ROOT,
      stdio: ["pipe", "pipe", "pipe"],
      env: { ...process.env, GITHUB_OUTPUT: "" },
    });

    const sourceMatch = output.match(/^source=(.+)$/m);
    const dataMatch = output.match(/^data=(.+)$/m);

    if (sourceMatch?.[1] === "comment-chain" && dataMatch?.[1]) {
      return JSON.parse(dataMatch[1]);
    }
  } catch (err) {
    const stderr = err.stderr || "";
    if (stderr) console.error(stderr.trimEnd());
  }
  return null;
}

function loadBootstrapBaseline() {
  if (!existsSync(BOOTSTRAP_PATH)) {
    return null;
  }
  console.error(
    "Using bootstrap baseline (bundle-sizes.json). This file is only needed\n" +
      "to seed the comment chain — once a PR merges with a bot comment, the\n" +
      "file can be deleted.\n"
  );
  return JSON.parse(readFileSync(BOOTSTRAP_PATH, "utf-8"));
}

function resolveBaseline() {
  if (ENV_BASELINE) {
    try {
      return { baseline: JSON.parse(ENV_BASELINE), source: "comment-chain" };
    } catch {
      failWithError("Failed to parse BUNDLE_SIZE_BASELINE env var as JSON.");
    }
  }

  console.error(
    "BUNDLE_SIZE_BASELINE not set — fetching from comment chain via gh CLI...\n"
  );
  const commentChainBaseline = fetchBaselineFromCommentChain();
  if (commentChainBaseline) {
    return { baseline: commentChainBaseline, source: "comment-chain" };
  }

  const bootstrapBaseline = loadBootstrapBaseline();
  if (bootstrapBaseline) {
    return { baseline: bootstrapBaseline, source: "bootstrap file" };
  }

  return { baseline: null, source: null };
}

function compare(currentSizes) {
  const { baseline, source: baselineSource } = resolveBaseline();

  if (!baseline) {
    failWithError(
      [
        "No baseline available. The comment-chain fetch did not produce a",
        "baseline, and no bootstrap file (bundle-sizes.json) was found.",
        "",
        "This means either:",
        "  1. The comment chain has not been established yet (first-time setup)",
        "  2. The GitHub API call failed (check GH_TOKEN / gh auth status)",
        "  3. The `bundle-sizes` label has been removed from all previously-merged PRs",
        "",
        "If this is a first-time setup, create a bundle-sizes.json bootstrap file",
        "to seed the comment chain. See docs/bundle-size-monitoring.md for instructions.",
        "",
        "If the chain was previously working, re-add the `bundle-sizes` label to the",
        "most recently merged PR that has a valid bot comment.",
      ].join("\n")
    );
  }

  let hasFailures = false;
  const rows = [];

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
          if (IS_APPROVED) {
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

  const statusOrder = { fail: 0, approved: 1, new: 2, removed: 3, ok: 4 };
  rows.sort((a, b) => {
    const so = statusOrder[a.status] - statusOrder[b.status];
    if (so !== 0) return so;
    return (b.currentSize ?? 0) - (a.currentSize ?? 0);
  });

  if (JSON_OUTPUT) {
    const packages = {};
    for (const row of rows) {
      if (!packages[row.pkg]) packages[row.pkg] = {};
      packages[row.pkg][row.format] = {
        current: row.currentSize,
        baseline: row.baselineSize,
        delta_pct:
          row.baselineSize != null && row.baselineSize > 0
            ? ((row.currentSize - row.baselineSize) / row.baselineSize) * 100
            : null,
        status: row.status,
      };
    }
    console.log(
      JSON.stringify(
        {
          baseline_source: baselineSource,
          packages,
          has_failures: hasFailures,
        },
        null,
        2
      )
    );
    if (hasFailures) process.exit(1);
    return;
  }

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
        `  If this increase is intentional, add the \`bundle-size-approved\` label with a comment about the reason for the increase and re-run CI.\n`
    );
    process.exit(1);
  }

  const hasApproved = rows.some((r) => r.status === "approved");
  if (hasApproved) {
    console.log(
      "~ Some packages exceed the threshold but have been approved via the bundle-size-approved label.\n"
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
  failWithError("No dist directories found.\nRun `pnpm build:packages` first.");
}

const sizes = measurePackages();
compare(sizes);
