#!/usr/bin/env node

/**
 * Bundle size check script for Nimbus.
 *
 * Measures gzipped sizes of built ES module files and compares against a
 * checked-in baseline. Exits non-zero when any file exceeds the error
 * threshold, making it suitable as a CI gate.
 *
 * Usage:
 *   node scripts/check-bundle-size.mjs                  # compare against baseline
 *   node scripts/check-bundle-size.mjs --update-baseline # regenerate baseline from current build
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { gzipSync } from "node:zlib";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const DIST = join(ROOT, "packages/nimbus/dist");
const BASELINE_PATH = join(__dirname, "bundle-size-baseline.json");

// Thresholds (percentage increase over baseline)
const WARN_THRESHOLD = 0.15; // 15%
const ERROR_THRESHOLD = 0.3; // 30%

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function gzipSize(filePath) {
  const content = readFileSync(filePath);
  return gzipSync(content, { level: 9 }).length;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
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

// ---------------------------------------------------------------------------
// Collect files to measure
// ---------------------------------------------------------------------------

function collectFiles() {
  const files = {};

  // Main entry point
  const mainEntry = join(DIST, "index.es.js");
  if (existsSync(mainEntry)) {
    files["index.es.js"] = mainEntry;
  }

  // Component entry points
  const componentsDir = join(DIST, "components");
  if (existsSync(componentsDir)) {
    for (const file of readdirSync(componentsDir)) {
      if (file.endsWith(".es.js")) {
        files[`components/${file}`] = join(componentsDir, file);
      }
    }
  }

  return files;
}

// ---------------------------------------------------------------------------
// Measure all files
// ---------------------------------------------------------------------------

function measureFiles(filePaths) {
  const sizes = {};
  for (const [key, fullPath] of Object.entries(filePaths)) {
    sizes[key] = gzipSize(fullPath);
  }
  return sizes;
}

// ---------------------------------------------------------------------------
// Update baseline
// ---------------------------------------------------------------------------

function updateBaseline(sizes) {
  const baseline = {
    generated: new Date().toISOString(),
    files: sizes,
  };
  writeFileSync(BASELINE_PATH, JSON.stringify(baseline, null, 2) + "\n");
  console.log(`Baseline updated at ${BASELINE_PATH}`);
  console.log(`Tracking ${Object.keys(sizes).length} files\n`);

  // Print summary
  const sorted = Object.entries(sizes).sort((a, b) => b[1] - a[1]);
  console.log(padEnd("File", 50) + padStart("Gzip Size", 12));
  console.log("-".repeat(62));
  for (const [file, size] of sorted) {
    console.log(padEnd(file, 50) + padStart(formatBytes(size), 12));
  }
}

// ---------------------------------------------------------------------------
// Compare against baseline
// ---------------------------------------------------------------------------

function compareToBaseline(currentSizes) {
  if (!existsSync(BASELINE_PATH)) {
    console.error(
      "No baseline file found. Run with --update-baseline first.\n" +
        `  node scripts/check-bundle-size.mjs --update-baseline`
    );
    process.exit(1);
  }

  const baseline = JSON.parse(readFileSync(BASELINE_PATH, "utf-8"));
  const baselineFiles = baseline.files;

  let hasWarnings = false;
  let hasErrors = false;
  const rows = [];

  // Check files present in current build
  for (const [file, currentSize] of Object.entries(currentSizes)) {
    const baselineSize = baselineFiles[file];

    if (baselineSize == null) {
      rows.push({ file, currentSize, baselineSize: null, status: "new" });
      continue;
    }

    const increase = (currentSize - baselineSize) / baselineSize;

    let status = "ok";
    if (increase > ERROR_THRESHOLD) {
      status = "error";
      hasErrors = true;
    } else if (increase > WARN_THRESHOLD) {
      status = "warn";
      hasWarnings = true;
    }

    rows.push({ file, currentSize, baselineSize, status });
  }

  // Check for files removed since baseline
  for (const file of Object.keys(baselineFiles)) {
    if (!(file in currentSizes)) {
      rows.push({
        file,
        currentSize: null,
        baselineSize: baselineFiles[file],
        status: "removed",
      });
    }
  }

  // Sort: errors first, then warnings, then the rest by size descending
  const statusOrder = { error: 0, warn: 1, new: 2, removed: 3, ok: 4 };
  rows.sort((a, b) => {
    const so = statusOrder[a.status] - statusOrder[b.status];
    if (so !== 0) return so;
    return (b.currentSize ?? 0) - (a.currentSize ?? 0);
  });

  // Print table
  const STATUS_ICONS = {
    ok: "  ",
    warn: "⚠ ",
    error: "✖ ",
    new: "✚ ",
    removed: "- ",
  };

  console.log(
    `\nBundle Size Report (baseline from ${baseline.generated})\n`
  );
  console.log(
    padEnd("File", 50) +
      padStart("Current", 12) +
      padStart("Baseline", 12) +
      padStart("Delta", 10) +
      "  Status"
  );
  console.log("-".repeat(90));

  for (const row of rows) {
    const current =
      row.currentSize != null ? formatBytes(row.currentSize) : "-";
    const base =
      row.baselineSize != null ? formatBytes(row.baselineSize) : "-";
    const delta =
      row.currentSize != null && row.baselineSize != null
        ? formatDelta(row.currentSize, row.baselineSize)
        : row.status;

    console.log(
      padEnd(row.file, 50) +
        padStart(current, 12) +
        padStart(base, 12) +
        padStart(delta, 10) +
        "  " +
        STATUS_ICONS[row.status] +
        row.status
    );
  }

  console.log("-".repeat(90));

  // Summary
  const totalCurrent = Object.values(currentSizes).reduce((a, b) => a + b, 0);
  const totalBaseline = Object.values(baselineFiles).reduce(
    (a, b) => a + b,
    0
  );
  console.log(
    padEnd("TOTAL", 50) +
      padStart(formatBytes(totalCurrent), 12) +
      padStart(formatBytes(totalBaseline), 12) +
      padStart(formatDelta(totalCurrent, totalBaseline), 10)
  );
  console.log();

  if (hasErrors) {
    console.log(
      `✖ FAIL: One or more files exceeded the ${(ERROR_THRESHOLD * 100).toFixed(0)}% error threshold.`
    );
    console.log(
      "  If this increase is intentional, run: node scripts/check-bundle-size.mjs --update-baseline"
    );
    process.exit(1);
  }

  if (hasWarnings) {
    console.log(
      `⚠ WARNING: One or more files exceeded the ${(WARN_THRESHOLD * 100).toFixed(0)}% warning threshold.`
    );
    console.log("  Review the changes above to ensure they are expected.\n");
  } else {
    console.log("✓ All files within acceptable size limits.\n");
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const shouldUpdate = args.includes("--update-baseline");

if (!existsSync(DIST)) {
  console.error(
    `dist directory not found at ${DIST}\n` +
      "Run pnpm build:packages first."
  );
  process.exit(1);
}

const filePaths = collectFiles();
const sizes = measureFiles(filePaths);

if (shouldUpdate) {
  updateBaseline(sizes);
} else {
  compareToBaseline(sizes);
}
