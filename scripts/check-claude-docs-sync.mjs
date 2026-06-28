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
  {
    // The react-aria-docs MCP tools are prefixed `..._react_aria_page(s)`; the
    // bare list_pages / get_page / get_page_info names do not exist and silently
    // no-op when an agent tries to call them.
    pattern: /mcp__react-aria-docs__(list_pages|get_page_info|get_page)\b/g,
    hint: "use the real react-aria-docs MCP tool names: `list_react_aria_pages`, `get_react_aria_page_info`, `get_react_aria_page`.",
  },
  {
    // The createRecipeContext/createSlotRecipeContext APIs take a string `key`
    // (the nimbus-prefixed registered recipe key), NOT a `recipe` object.
    pattern: /create(?:Slot)?RecipeContext\(\{\s*recipe\b/g,
    hint: "createRecipeContext/createSlotRecipeContext resolve the recipe by its registered `nimbus`-prefixed key — pass `{ key: \"nimbusX\" }`, not `{ recipe }`.",
  },
];

// Collect all docs/ references and validate them.
const docsRefRe = /@?docs\/[A-Za-z0-9._/-]+\.mdx?/g;

// Concrete source paths referenced in prose/examples must exist. This is the
// drift class the friction logs flagged most ("the skills predate a refactor"):
// hard-coded file paths that go stale when files move or change extension.
const codePathRe =
  /\b(?:packages\/nimbus\/src|src\/theme|src\/components|src\/type-utils|src\/utils)\/[A-Za-z0-9._/-]+\.(?:tsx?|mjs|json)\b/g;
// Generated/templated artifacts that legitimately may be absent on a clean tree.
const isExcludedPath = (p) =>
  /[{}*]/.test(p) || // template placeholder or glob
  p.includes("styled-system/") ||
  p.includes("/intl/") ||
  p.endsWith(".messages.ts");

function checkCodePaths(text, rel) {
  for (const m of text.matchAll(codePathRe)) {
    const p = m[0];
    if (isExcludedPath(p)) continue;
    const full = p.startsWith("packages/") ? p : join("packages", "nimbus", p);
    if (!existsSync(join(ROOT, full))) {
      errors.push(`${rel}: references missing source path "${p}"`);
    }
  }
}

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

  checkCodePaths(text, rel);
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
  checkCodePaths(text, rel);
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

// Skill integrity: every directory under .claude/skills/ must contain a
// SKILL.md. An empty/husk dir (e.g. left behind by a rename) is invisible to
// the model and a silent dead end.
const skillsRoot = join(ROOT, ".claude", "skills");
if (existsSync(skillsRoot)) {
  for (const entry of readdirSync(skillsRoot)) {
    if (entry === "worktrees" || entry === "node_modules") continue;
    const dir = join(skillsRoot, entry);
    if (!statSync(dir).isDirectory()) continue;
    if (!existsSync(join(dir, "SKILL.md"))) {
      errors.push(
        `.claude/skills/${entry}/ has no SKILL.md (empty or broken skill directory)`
      );
    }
  }
}

// Cross-link + anchor validation across the canonical docs. Relative/absolute
// Markdown links and #section anchors must resolve. Catches broken section links
// that the docs/-path check above misses (it ignores anchors and relative paths).
// GitHub-style heading slug: lowercase, delete punctuation (keep word chars,
// whitespace, hyphen), then replace each whitespace with a hyphen WITHOUT
// collapsing (so "a — b" → "a--b" and "aren't" → "arent", matching GitHub).
const slugNorm = (s) =>
  s
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s/g, "-");
const headingCache = new Map();
function headingSlugs(absFile) {
  if (headingCache.has(absFile)) return headingCache.get(absFile);
  const set = new Set();
  if (existsSync(absFile)) {
    for (const line of readFileSync(absFile, "utf8").split("\n")) {
      const h = /^#{1,6}\s+(.+?)\s*$/.exec(line);
      if (h) set.add(slugNorm(h[1]));
    }
  }
  headingCache.set(absFile, set);
  return set;
}
const linkRe = /\]\(([^)\s]+)\)/g;
for (const file of walk(join(ROOT, "docs")).filter((f) => f.endsWith(".md"))) {
  const text = readFileSync(file, "utf8");
  const rel = relative(ROOT, file);
  const dir = join(file, "..");
  for (const m of text.matchAll(linkRe)) {
    const target = m[1];
    if (/^(https?:|mailto:|tel:|#?\$)/.test(target)) continue;
    if (/[{}$<>]/.test(target)) continue; // template placeholder
    const [path, anchor] = target.split("#");
    if (path !== "" && !/\.mdx?$/.test(path)) continue; // only validate doc links
    const absTarget =
      path === "" ? file : join(path.startsWith("/") ? ROOT : dir, path);
    if (path !== "" && !existsSync(absTarget)) {
      errors.push(`${rel}: broken link to "${path}"`);
      continue;
    }
    if (anchor && !headingSlugs(absTarget).has(slugNorm(anchor))) {
      errors.push(
        `${rel}: broken anchor "#${anchor}" → ${relative(ROOT, absTarget)}`
      );
    }
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
