#!/usr/bin/env node

/**
 * Package shape check for Nimbus.
 *
 * For each publishable package: runs `pnpm pack` to produce a tarball that
 * matches what npm would publish, then runs two linters against it:
 *
 *   - @arethetypeswrong/cli (attw): validates types resolve correctly across
 *     module-resolution modes (node10, node16, bundler) — catches `exports`
 *     map mistakes and ESM/CJS interop foot-guns.
 *   - publint: validates package.json correctness against the npm spec.
 *
 * Exits non-zero on any finding so CI blocks the merge. Flip REPORT_ONLY to
 * true temporarily if you need the check to surface findings without failing.
 *
 * Usage:
 *   node scripts/check-package-shape.mjs
 *
 * Requires the target packages to be built first (their dist/ must exist).
 */

import { execSync, spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");

const REPORT_ONLY = false;

const PACKAGES = [
  { name: "@commercetools/nimbus", dir: join(ROOT, "packages/nimbus") },
  {
    name: "@commercetools/nimbus-icons",
    dir: join(ROOT, "packages/nimbus-icons"),
  },
  { name: "@commercetools/nimbus-mcp", dir: join(ROOT, "packages/nimbus-mcp") },
];

const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const RESET = "\x1b[0m";

function header(text) {
  const bar = "─".repeat(Math.max(0, 72 - text.length - 2));
  console.log(`\n${BOLD}${CYAN}${text}${RESET} ${DIM}${bar}${RESET}`);
}

function packTarball(pkg, destDir) {
  const out = execSync(`pnpm pack --pack-destination "${destDir}" --json`, {
    cwd: pkg.dir,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
  });
  // pnpm pack --json's `filename` is an absolute path to the tarball.
  const parsed = JSON.parse(out);
  return parsed.filename;
}

function runTool(label, bin, args) {
  console.log(`${DIM}$ ${bin} ${args.join(" ")}${RESET}`);
  const result = spawnSync("pnpm", ["exec", bin, ...args], {
    cwd: ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  const passed = result.status === 0;
  console.log(
    passed
      ? `${GREEN}✓ ${label} passed${RESET}`
      : `${YELLOW}⚠ ${label} reported findings (exit ${result.status})${RESET}`
  );
  return passed;
}

function main() {
  const workDir = mkdtempSync(join(tmpdir(), "nimbus-pkg-shape-"));
  const failures = [];

  try {
    for (const pkg of PACKAGES) {
      header(pkg.name);

      if (!existsSync(pkg.dir)) {
        console.log(`${YELLOW}⚠ Skipping — ${pkg.dir} not found${RESET}`);
        continue;
      }

      let tarball;
      try {
        tarball = packTarball(pkg, workDir);
        console.log(`${DIM}packed: ${tarball}${RESET}\n`);
      } catch (err) {
        console.log(`${RED}✗ Failed to pack ${pkg.name}${RESET}`);
        console.log(err.message);
        failures.push({ pkg: pkg.name, tool: "pack" });
        continue;
      }

      const attwOk = runTool("attw", "attw", [tarball]);
      const publintOk = runTool("publint", "publint", [tarball]);

      if (!attwOk) failures.push({ pkg: pkg.name, tool: "attw" });
      if (!publintOk) failures.push({ pkg: pkg.name, tool: "publint" });
    }
  } finally {
    rmSync(workDir, { recursive: true, force: true });
  }

  header("Summary");
  if (failures.length === 0) {
    console.log(`${GREEN}All packages passed both checks.${RESET}`);
    process.exit(0);
  }

  console.log(`${YELLOW}Findings:${RESET}`);
  for (const f of failures) {
    console.log(`  - ${f.pkg}: ${f.tool}`);
  }

  if (REPORT_ONLY) {
    console.log(
      `\n${DIM}REPORT_ONLY mode: exiting 0 despite ${failures.length} finding(s). Flip REPORT_ONLY to false to fail CI on findings.${RESET}`
    );
    process.exit(0);
  }
  process.exit(1);
}

main();
