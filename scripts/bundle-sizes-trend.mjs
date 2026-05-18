#!/usr/bin/env node

import { execSync } from "node:child_process";

const DEFAULT_LIMIT = 20;
const DATA_BLOCK_RE = /<!-- bundle-sizes-data-v(\d+): ({.*?}) -->/;

const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  console.log(`Usage: bundle-sizes-trend [options]

Show bundle size trend from merged PR comments.

Options:
  --limit N   Number of merged PRs to query (default: ${DEFAULT_LIMIT})
  --json      Output raw JSON instead of a table
  --help, -h  Show this help message`);
  process.exit(0);
}

try {
  execSync("gh --version", { stdio: "ignore" });
} catch {
  console.error(
    "Error: GitHub CLI (gh) is not installed.\n" +
      "Install it from https://cli.github.com and run `gh auth login`."
  );
  process.exit(1);
}

const jsonOutput = args.includes("--json");
const limitIdx = args.indexOf("--limit");
const limit =
  limitIdx !== -1 ? Number.parseInt(args[limitIdx + 1], 10) : DEFAULT_LIMIT;

if (Number.isNaN(limit) || limit < 1) {
  console.error("Error: --limit must be a positive integer.");
  process.exit(1);
}

function gh(args) {
  return execSync(`gh ${args}`, {
    encoding: "utf-8",
    stdio: ["pipe", "pipe", "pipe"],
  }).trim();
}

function detectRepo() {
  try {
    return gh("repo view --json nameWithOwner --jq .nameWithOwner");
  } catch {
    console.error(
      "Error: could not detect repository. Make sure you are in a git repo with a GitHub remote."
    );
    process.exit(1);
  }
}

const repo = detectRepo();

const prsJson = gh(
  `api "repos/${repo}/pulls?state=closed&labels=bundle-sizes&per_page=${limit}&sort=updated&direction=desc" --jq '[.[] | select(.merged_at != null) | {number, title, merged_at}]'`
);

const prs = JSON.parse(prsJson);

if (prs.length === 0) {
  console.log(
    "No trend data found; has the comment-chain workflow been set up?"
  );
  process.exit(0);
}

const entries = [];

for (const pr of prs) {
  const commentBody = gh(
    `api "repos/${repo}/issues/${pr.number}/comments" --jq '[.[] | select(.user.login == "github-actions[bot]") | select(.body | contains("bundle-sizes-comment"))] | .[0].body // empty'`
  );

  if (!commentBody) continue;

  const match = commentBody.match(DATA_BLOCK_RE);
  if (!match) continue;

  const version = Number.parseInt(match[1], 10);
  if (version !== 1) {
    console.warn(
      `Warning: skipping PR #${pr.number} — unrecognized data block version ${version}`
    );
    continue;
  }

  try {
    const sizes = JSON.parse(match[2]);
    entries.push({
      number: pr.number,
      title: pr.title,
      mergedAt: pr.merged_at,
      sizes,
    });
  } catch {
    console.warn(
      `Warning: skipping PR #${pr.number} — could not parse data block`
    );
  }
}

if (entries.length === 0) {
  console.log(
    "No trend data found; merged PRs exist but none contain a parseable data block."
  );
  process.exit(0);
}

// Oldest first so deltas read chronologically
entries.reverse();

if (jsonOutput) {
  console.log(JSON.stringify(entries, null, 2));
  process.exit(0);
}

const allPackages = [
  ...new Set(entries.flatMap((e) => Object.keys(e.sizes))),
].sort();

const rows = entries.map((entry, i) => {
  const row = {
    PR: `#${entry.number}`,
    Title:
      entry.title.length > 40 ? entry.title.slice(0, 37) + "..." : entry.title,
    Merged: entry.mergedAt.slice(0, 10),
  };

  for (const pkg of allPackages) {
    const shortName = pkg.replace("@commercetools/", "");
    const bytes = entry.sizes[pkg]?.dist;
    const kb = bytes != null ? (bytes / 1024).toFixed(1) : "—";
    row[`${shortName} (KB)`] = kb;

    let delta = "—";
    if (i > 0) {
      const prevBytes = entries[i - 1].sizes[pkg]?.dist;
      if (bytes != null && prevBytes != null) {
        const diff = bytes - prevBytes;
        if (diff === 0) {
          delta = "0";
        } else {
          const sign = diff > 0 ? "+" : "";
          delta = `${sign}${(diff / 1024).toFixed(1)}`;
        }
      }
    }
    row[`${shortName} Δ`] = delta;
  }

  return row;
});

console.table(rows);
