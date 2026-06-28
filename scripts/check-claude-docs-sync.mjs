#!/usr/bin/env node
// Guardrail: keep the .claude/ tooling and docs/ source-of-truth in sync.
//
// The .claude/ commands, agents, and skills are designed to REFERENCE canonical
// docs/ files rather than copy them (see docs/claude-tooling.md). References rot
// silently when a doc moves or a command is renamed. This check fails CI/precommit
// when that happens, so drift is caught at write-time instead of in a later audit.
//
// Checks (errors fail the build; warnings don't):
//   1. ERROR  — a .claude/ or docs/claude-tooling.md file references a `docs/…md(x)`
//               path that does not exist on disk.
//   2. ERROR  — a reference to a retired slash command (e.g. the pre-#1378
//               `/openspec:*` namespace; use `/opsx:*`).
//   3. WARN   — a docs/file-type-guidelines/*.md guideline referenced by no
//               .claude/ file (orphaned from tooling).
//
// Usage: node scripts/check-claude-docs-sync.mjs   (alias: pnpm check:claude-docs)

import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(import.meta.url), "..", "..");
const errors = [];
const warnings = [];

/** Recursively collect files under `dir`, skipping the given directory names. */
function walk(dir, skip = []) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    if (skip.includes(entry)) continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full, skip));
    else out.push(full);
  }
  return out;
}

// Scan the .claude tooling (excluding transient worktrees) plus the tooling map.
const claudeFiles = walk(join(ROOT, ".claude"), ["worktrees", "node_modules"])
  .filter((f) => f.endsWith(".md") || f.endsWith(".ts") || f.endsWith(".mjs"));
const toolingMap = join(ROOT, "docs", "claude-tooling.md");
const scanFiles = existsSync(toolingMap)
  ? [...claudeFiles, toolingMap]
  : claudeFiles;

// The canonical guideline docs are the source of truth the tooling defers to,
// so they must be self-consistent (no stale paths/commands) as well.
const docsGuidelines = [
  ...walk(join(ROOT, "docs", "file-type-guidelines")).filter((f) => f.endsWith(".md")),
  join(ROOT, "docs", "naming-conventions.md"),
  join(ROOT, "docs", "component-guidelines.md"),
  join(ROOT, "docs", "types-architecture.md"),
].filter((f) => existsSync(f));

// Retired references that must never reappear (renamed/removed tooling).
const RETIRED = [
  {
    pattern: /\/?openspec:(propose|proposal|apply|archive|explore)/g,
    hint: "the OpenSpec commands were migrated to the `opsx:` namespace in #1378 — use `/opsx:propose` etc.",
  },
  {
    pattern: /theme\/recipes\.ts\b/g,
    hint: "there is no `theme/recipes.ts`; standard recipes register in `theme/recipes/index.ts`, slot recipes in `theme/slot-recipes/index.ts`.",
  },
  {
    // Matches ../utils/slot-types and components/utils/slot-types, but NOT the
    // correct type-utils/slot-types path.
    pattern: /(?<!type-)utils\/slot-types/g,
    hint: "`SlotComponent` lives in `type-utils` — import from `@/type-utils`.",
  },
];

// Collect all docs/ references and validate them.
const docsRefRe = /@?docs\/[A-Za-z0-9._/-]+\.mdx?/g;
const corpus = [];

for (const file of scanFiles) {
  const text = readFileSync(file, "utf8");
  corpus.push(text);
  const rel = relative(ROOT, file);

  for (const m of text.matchAll(docsRefRe)) {
    const refPath = m[0].replace(/^@/, "").replace(/#.*$/, "");
    if (!existsSync(join(ROOT, refPath))) {
      errors.push(`${rel}: references missing doc "${refPath}"`);
    }
  }

  for (const { pattern, hint } of RETIRED) {
    pattern.lastIndex = 0;
    if (pattern.test(text)) {
      // Allow the guard script + tooling map to *name* retired refs in prose.
      if (rel.endsWith("check-claude-docs-sync.mjs")) continue;
      if (rel === "docs/claude-tooling.md") continue;
      errors.push(`${rel}: contains retired reference matching ${pattern} — ${hint}`);
    }
  }
}

// Canonical guideline docs: must be free of stale paths/commands and must not
// reference missing docs. (Not part of the orphan corpus below.)
for (const file of docsGuidelines) {
  const text = readFileSync(file, "utf8");
  const rel = relative(ROOT, file);
  for (const m of text.matchAll(docsRefRe)) {
    const refPath = m[0].replace(/^@/, "").replace(/#.*$/, "");
    if (!existsSync(join(ROOT, refPath))) {
      errors.push(`${rel}: references missing doc "${refPath}"`);
    }
  }
  for (const { pattern, hint } of RETIRED) {
    pattern.lastIndex = 0;
    if (pattern.test(text)) {
      errors.push(`${rel}: contains retired reference matching ${pattern} — ${hint}`);
    }
  }
}

// Orphan check: every file-type guideline should be wired into the tooling.
const ftgDir = join(ROOT, "docs", "file-type-guidelines");
const joined = corpus.join("\n");
for (const f of walk(ftgDir).filter((f) => f.endsWith(".md"))) {
  const name = relative(join(ROOT, "docs"), f); // e.g. file-type-guidelines/recipes.md
  if (name.endsWith("index.md")) continue;
  if (!joined.includes(name)) {
    warnings.push(`docs/${name} is not referenced by any .claude/ tooling (orphaned)`);
  }
}

for (const w of warnings) console.warn(`⚠️  ${w}`);
for (const e of errors) console.error(`❌ ${e}`);

if (errors.length) {
  console.error(`\n${errors.length} error(s): .claude/ tooling is out of sync with docs/. See docs/claude-tooling.md.`);
  process.exit(1);
}
console.log(
  `✅ .claude/ tooling references resolve (${scanFiles.length} files scanned, ${warnings.length} warning(s)).`
);
