#!/usr/bin/env node

/**
 * Tiered workspace cleanup for Nimbus.
 *
 * The repo generates a class of gitignored, regenerable artifacts that live
 * OUTSIDE `node_modules`/`dist` — most importantly inside `src/`. Because they
 * are gitignored, git leaves them untouched on branch switch, so they go stale
 * and leak across branches. The classic symptom: build a new component on one
 * branch (which generates `components/<comp>/intl/` + `<comp>.messages.ts`),
 * switch to a branch where that component was never committed, and the orphaned
 * generated files remain — TypeScript still compiles them (`src/**` is in the
 * project), producing phantom errors on every branch. Stale `*.tsbuildinfo`
 * incremental caches cause the same kind of cross-branch ghost errors.
 *
 * This script removes those artifacts. It NEVER deletes tracked source or
 * generated-but-committed files (`packages/tokens/src/generated` is the only
 * generated tree that is committed), and — by matching specific targets rather
 * than blanket-deleting everything gitignored — it never touches user-owned
 * local config (`.env*`, `.vscode/`, `.idea/`, `.claude/settings.local.json`).
 *
 * Three tiers, selected by flags:
 *
 *   node scripts/clean.mjs
 *     Tier 1 (fast / surgical, wired to `pnpm nimbus:clean`). Removes caches
 *     and ORPHANED i18n only — component dirs whose entire contents are
 *     generated i18n (intl/ + *.messages.ts) with no real source left. Live
 *     components keep their generated i18n, so the tree still typechecks
 *     immediately afterward — no rebuild required.
 *
 *   node scripts/clean.mjs --all
 *     Tier 1 + every generated artifact + all dist/. Needs a rebuild after
 *     (`pnpm extract-intl && pnpm build`). Keeps installed dependencies.
 *
 *   node scripts/clean.mjs --all --node-modules
 *     Full reset (wired to `pnpm nimbus:reset`). Tier 1 + --all + node_modules.
 *
 * Extra flags:
 *   --dry-run   List what would be removed without deleting anything.
 *
 * Idempotent: safe to run repeatedly; a missing target is a no-op.
 *
 * MAINTAINERS: when a new tool starts producing a cache or generated artifact,
 * add its path/glob to CACHE_PATTERNS (caches, removed in every tier) or
 * GENERATED_PATTERNS (build output, removed by --all) below. If the artifact is
 * committed-but-generated (like packages/tokens/src/generated), add it to
 * PROTECTED instead so it is never touched. Use `--dry-run` to confirm the new
 * pattern matches what you expect and nothing more.
 */

import { readdirSync, rmSync, existsSync, statSync } from "node:fs";
import { execSync } from "node:child_process";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { styleText } from "node:util";
import { globSync } from "glob";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");

const args = process.argv.slice(2);
const ALL = args.includes("--all");
const NODE_MODULES = args.includes("--node-modules");
const DRY_RUN = args.includes("--dry-run");

// ── Targets (glob patterns, relative to repo root) ───────────────────────────

// Caches — removed in every tier. Always safe; forces a fresh typecheck/build.
const CACHE_PATTERNS = [
  "**/.turbo",
  "**/.swc",
  "**/.cache",
  "**/coverage",
  "**/storybook-static",
  "**/*.tsbuildinfo",
  "**/.eslintcache",
  "**/.stylelintcache",
];

// Generated artifacts — removed by --all. Comment notes what regenerates each.
const GENERATED_PATTERNS = [
  "**/dist", // pnpm build
  "packages/nimbus/src/components/**/intl", // pnpm extract-intl
  "packages/nimbus/src/components/**/*.messages.ts", // pnpm extract-intl
  "packages/i18n/.temp", // pnpm extract-intl
  "packages/nimbus-icons/src/material-icons", // icons build:icons
  "apps/docs/src/data/routes", // pnpm build:docs
  "apps/docs/src/data/types", // pnpm build:docs
  "apps/docs/src/data/route-manifest.json", // pnpm build:docs
  "apps/docs/src/data/search-index.json", // pnpm build:docs
  "packages/nimbus-mcp/data", // pnpm build:mcp
];

// Never matched by any pattern: things inside node_modules (handled separately),
// git internals, and the ONLY committed generated tree.
const PROTECTED = [
  "**/node_modules/**",
  "**/.git/**",
  "packages/tokens/src/generated/**",
];

const COMPONENTS_DIR = join(ROOT, "packages/nimbus/src/components");

/**
 * Glob one or more patterns under {@link ROOT}, matching dot-files.
 *
 * @param {string | string[]} patterns - Glob pattern(s), relative to ROOT.
 * @param {object} [options]
 * @param {string[]} [options.ignore=PROTECTED] - Glob patterns to exclude.
 * @returns {string[]} Matched paths, relative to ROOT.
 */
function find(patterns, { ignore = PROTECTED } = {}) {
  return globSync(patterns, { cwd: ROOT, dot: true, ignore });
}

// Git-tracked guard. Some i18n files (e.g. toast/, combobox/intl/de.ts) are
// committed despite the .gitignore patterns — git keeps tracking files added
// before an ignore rule, and tooling can force-add them. The targets here are
// meant to be regenerable, but a tracked file is committed source we must never
// delete. So we build the set of tracked paths and skip anything tracked, or any
// directory that contains a tracked file. (If git is unavailable, we warn and
// proceed without the guard — the targets are still overwhelmingly gitignored.)
const tracked = (() => {
  try {
    const out = execSync("git ls-files -z", {
      cwd: ROOT,
      maxBuffer: 1 << 28,
    });
    return new Set(out.toString("utf8").split("\0").filter(Boolean));
  } catch {
    console.warn(
      styleText(
        "yellow",
        "⚠ git unavailable — proceeding without the tracked-file guard."
      )
    );
    return null;
  }
})();

/** @type {string[]} Tracked paths skipped during collection (reported to the user). */
const protectedPaths = [];

/**
 * Whether a path is protected by the git-tracked guard: either it is a tracked
 * file itself, or it is a directory that contains a tracked file.
 *
 * @param {string} rel - Path relative to ROOT, forward-slash separated.
 * @returns {boolean} `true` if the path must not be deleted.
 */
function isTracked(rel) {
  if (!tracked) return false;
  if (tracked.has(rel)) return true; // the path itself is a tracked file
  const prefix = rel.endsWith("/") ? rel : `${rel}/`;
  for (const t of tracked) if (t.startsWith(prefix)) return true; // dir holds one
  return false;
}

// ── Collection ───────────────────────────────────────────────────────────────

/** @type {Map<string, Set<string>>} Category label → absolute paths to remove. */
const removals = new Map();

/**
 * Record paths for removal under a category, skipping anything that does not
 * exist or is protected by the git-tracked guard (see {@link isTracked}).
 *
 * @param {string} category - Display label the paths are grouped under.
 * @param {string[]} relPaths - Candidate paths, relative to ROOT.
 * @returns {void}
 */
function add(category, relPaths) {
  for (const rel of relPaths) {
    const abs = join(ROOT, rel);
    if (!existsSync(abs)) continue;
    if (isTracked(rel)) {
      protectedPaths.push(rel);
      continue;
    }
    if (!removals.has(category)) removals.set(category, new Set());
    removals.get(category).add(abs);
  }
}

/**
 * Orphaned-i18n pass (tier 1, always). A top-level component dir is an orphan
 * when every entry it contains is generated i18n (the `intl/` dir or a
 * `*.messages.ts` file) — i.e. the real source was removed (e.g. on a branch
 * switch) but the gitignored generated files were left behind. Such a dir is
 * removed wholesale. Live components always have source files, so they are
 * never matched. (Not expressible as a glob — hence the explicit pass.)
 *
 * @returns {string[]} Orphaned component directories, relative to ROOT.
 */
function findOrphanedI18n() {
  if (!existsSync(COMPONENTS_DIR)) return [];
  return readdirSync(COMPONENTS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .filter((e) => {
      const contents = readdirSync(join(COMPONENTS_DIR, e.name));
      return (
        contents.length > 0 &&
        contents.every((n) => n === "intl" || n.endsWith(".messages.ts"))
      );
    })
    .map((e) => join("packages/nimbus/src/components", e.name));
}

add("caches", find(CACHE_PATTERNS));
add("orphaned i18n", findOrphanedI18n());
if (ALL) add("generated artifacts", find(GENERATED_PATTERNS));
if (NODE_MODULES) {
  // Keep only top-level node_modules dirs (a single `node_modules` segment);
  // deleting those removes any nested ones too.
  const nodeModules = find("**/node_modules", {
    ignore: ["**/.git/**"],
  }).filter(
    (p) => p.split("/").filter((s) => s === "node_modules").length === 1
  );
  add("node_modules", nodeModules);
}

// ── Run ──────────────────────────────────────────────────────────────────────

const tier = NODE_MODULES
  ? "full reset (node_modules + generated + caches)"
  : ALL
    ? "generated artifacts + caches (deps kept)"
    : "caches + orphaned i18n (surgical)";

console.log(
  "\n" +
    styleText(["bold", "cyan"], "nimbus clean") +
    styleText("dim", ` — ${tier}${DRY_RUN ? " — DRY RUN" : ""}`) +
    "\n"
);

if (protectedPaths.length > 0) {
  console.log(
    styleText("yellow", "⚠") +
      ` Kept ${styleText("bold", String(protectedPaths.length))} git-tracked path(s) that match cleanup patterns ` +
      styleText("dim", "(committed source — see `git ls-files`):")
  );
  for (const rel of protectedPaths.sort()) {
    console.log(`  ${styleText("dim", "kept")} ${rel}`);
  }
  console.log("");
}

const categories = [...removals.keys()].sort();
if (categories.length === 0) {
  console.log(
    styleText("green", "✓") + " Nothing to remove — already clean.\n"
  );
  process.exit(0);
}

let total = 0;
for (const category of categories) {
  const paths = [...removals.get(category)].sort();
  total += paths.length;
  console.log(
    styleText("bold", category) + styleText("dim", ` (${paths.length})`)
  );
  for (const abs of paths) {
    const kind = statSync(abs).isDirectory() ? "dir " : "file";
    console.log(`  ${styleText("dim", kind)} ${relative(ROOT, abs) || "."}`);
    if (!DRY_RUN) rmSync(abs, { recursive: true, force: true });
  }
  console.log("");
}

const summary = DRY_RUN
  ? styleText("yellow", "•") +
    ` Would remove ${styleText("bold", String(total))} item(s).`
  : styleText("green", "✓") +
    ` Removed ${styleText("bold", String(total))} item(s).`;
console.log(summary + "\n");

if (ALL && !DRY_RUN) {
  console.log(
    styleText("dim", "Generated artifacts were removed — run ") +
      styleText("bold", "pnpm extract-intl && pnpm build") +
      styleText("dim", " (or ") +
      styleText("bold", "pnpm nimbus:init") +
      styleText("dim", ") to regenerate.\n")
  );
}

process.exit(0);
