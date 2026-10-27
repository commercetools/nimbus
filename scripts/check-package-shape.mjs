#!/usr/bin/env node

/**
 * Package shape check for Nimbus.
 *
 * For each publishable workspace (discovered from `pnpm m ls`, see
 * `discoverPackages`): runs `pnpm pack` to produce a tarball that
 * matches what npm would publish, then runs two linters against it:
 *
 *   - @arethetypeswrong/cli (attw): validates types resolve correctly across
 *     module-resolution modes (node10, node16, bundler) — catches `exports`
 *     map mistakes and ESM/CJS interop foot-guns.
 *   - publint: validates package.json correctness against the npm spec.
 *
 * Packages are checked in parallel; per-package output is buffered and printed
 * in declared order after all finish so the log stays readable. Exits non-zero
 * on any finding so CI blocks the merge. Flip REPORT_ONLY to true temporarily
 * if you need the check to surface findings without failing.
 *
 * Usage:
 *   node scripts/check-package-shape.mjs
 *
 * Requires the target packages to be built first (their dist/ must exist).
 */

import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");

const REPORT_ONLY = false;

// Publishable workspaces that are deliberately not checked yet. Remove an entry
// once its shape issue is fixed and `pnpm check:package-shape` exits 0 for it.
//
// `@commercetools/nimbus-tokens` ships with a pre-existing shape issue tracked
// in https://github.com/commercetools/nimbus/issues/1509. Two interacting
// problems were reported there — preconstruct emits `.cjs.js` under a
// package that declares `"type": "module"`, so the CJS path was broken at
// runtime; and the `exports` map's `import` condition has no `types`
// condition, so ESM consumers under node16/bundler resolution get no types.
// The first (runtime CJS breakage) is fixed by
// `packages/tokens/scripts/postbuild-cjs-extensions.mjs` and the `require`
// condition's `types` entry in `packages/tokens/package.json`. The second
// (missing ESM types) is still open — remove this entry once that's
// resolved too.
const EXCLUDED_PACKAGES = new Set(["@commercetools/nimbus-tokens"]);

const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const RESET = "\x1b[0m";

function header(text) {
  const bar = "─".repeat(Math.max(0, 72 - text.length - 2));
  return `\n${BOLD}${CYAN}${text}${RESET} ${DIM}${bar}${RESET}\n`;
}

function runCommand(cmd, args, { cwd }) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      cwd,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => (stdout += chunk.toString()));
    child.stderr.on("data", (chunk) => (stderr += chunk.toString()));
    child.on("error", reject);
    child.on("close", (code) => resolve({ code, stdout, stderr }));
  });
}

// Every workspace without `"private": true` is published, so it is checked.
async function discoverPackages() {
  const { code, stdout, stderr } = await runCommand(
    "pnpm",
    ["m", "ls", "--json", "--depth", "-1"],
    { cwd: ROOT }
  );
  if (code !== 0) {
    throw new Error(`pnpm m ls exited ${code}\n${stderr}`);
  }
  return JSON.parse(stdout)
    .filter((w) => w.private !== true && !EXCLUDED_PACKAGES.has(w.name))
    .map((w) => ({ name: w.name, dir: w.path }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

async function packTarball(pkg, destDir) {
  const { code, stdout, stderr } = await runCommand(
    "pnpm",
    ["pack", "--pack-destination", destDir, "--json"],
    { cwd: pkg.dir }
  );
  if (code !== 0) {
    throw new Error(`pnpm pack exited ${code}\n${stderr}`);
  }
  // pnpm pack --json's `filename` is an absolute path to the tarball.
  return JSON.parse(stdout).filename;
}

async function runTool(label, bin, args, log) {
  log(`${DIM}$ ${bin} ${args.join(" ")}${RESET}\n`);
  const { code, stdout, stderr } = await runCommand(
    "pnpm",
    ["exec", bin, ...args],
    { cwd: ROOT }
  );
  if (stdout) log(stdout);
  if (stderr) log(stderr);
  const passed = code === 0;
  log(
    passed
      ? `${GREEN}✓ ${label} passed${RESET}\n`
      : `${YELLOW}⚠ ${label} reported findings (exit ${code})${RESET}\n`
  );
  return passed;
}

async function checkPackage(pkg, workDir) {
  const buffer = [];
  const log = (text) => buffer.push(text);
  const failures = [];

  log(header(pkg.name));

  let tarball;
  try {
    tarball = await packTarball(pkg, workDir);
    log(`${DIM}packed: ${tarball}${RESET}\n\n`);
  } catch (err) {
    log(`${RED}✗ Failed to pack ${pkg.name}${RESET}\n`);
    log(`${err.message}\n`);
    failures.push({ pkg: pkg.name, tool: "pack" });
    return { buffer, failures };
  }

  const attwOk = await runTool("attw", "attw", [tarball], log);
  const publintOk = await runTool("publint", "publint", [tarball], log);

  if (!attwOk) failures.push({ pkg: pkg.name, tool: "attw" });
  if (!publintOk) failures.push({ pkg: pkg.name, tool: "publint" });

  return { buffer, failures };
}

async function main() {
  const workDir = mkdtempSync(join(tmpdir(), "nimbus-pkg-shape-"));
  const failures = [];

  try {
    const packages = await discoverPackages();
    const results = await Promise.all(
      packages.map((pkg) => checkPackage(pkg, workDir))
    );
    for (const { buffer, failures: pkgFailures } of results) {
      for (const chunk of buffer) process.stdout.write(chunk);
      failures.push(...pkgFailures);
    }
  } finally {
    rmSync(workDir, { recursive: true, force: true });
  }

  process.stdout.write(header("Summary"));
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

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
