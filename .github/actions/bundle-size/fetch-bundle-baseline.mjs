#!/usr/bin/env node

/**
 * Fetches the bundle size baseline from the comment chain.
 *
 * Queries the most recently updated merged PR with the "bundle-sizes" label,
 * extracts the machine-readable data block from the bot comment, and writes
 * the result to GITHUB_OUTPUT for downstream workflow steps.
 *
 * Outputs (via GITHUB_OUTPUT):
 *   source   — "comment-chain" when the baseline was found, or "bootstrap"
 *              when it was not (comment chain not yet established, or broken)
 *   data     — JSON string of baseline sizes (only when source is "comment-chain")
 *
 * When source is "bootstrap", downstream steps should fall back to a local
 * bundle-sizes.json bootstrap file. If that file does not exist either, the
 * comment chain must be established first — see docs/bundle-size-monitoring.md.
 *
 * Environment variables:
 *   GITHUB_REPOSITORY   owner/repo (set by Actions; falls back to the current
 *                       checkout via `gh repo view` when unset locally)
 *   GH_TOKEN            GitHub token for API access
 *   GITHUB_OUTPUT       Path to the output file (set by Actions)
 */

import { execSync } from "node:child_process";
import { appendFileSync } from "node:fs";

const OUTPUT_FILE = process.env.GITHUB_OUTPUT;

function gh(args) {
  return execSync(`gh ${args}`, {
    encoding: "utf-8",
    stdio: ["pipe", "pipe", "pipe"],
  }).trim();
}

// GITHUB_REPOSITORY is injected by Actions but absent locally, so derive the
// slug from the checkout when it's unset. This catch only runs locally (CI
// always sets the env var), so a hard exit here can't affect the workflow —
// and an empty slug would only produce a misleading downstream error.
function resolveRepo() {
  if (process.env.GITHUB_REPOSITORY) return process.env.GITHUB_REPOSITORY;
  try {
    return gh("repo view --json nameWithOwner --jq .nameWithOwner");
  } catch {
    console.error(
      [
        "Error: could not determine the repository via the GitHub CLI.",
        "Running check:bundle-size locally needs `gh` installed and",
        "authenticated: install it (https://cli.github.com), run",
        "`gh auth login`, and run the command from inside the repo directory.",
      ].join("\n")
    );
    process.exit(1);
  }
}

const REPO = resolveRepo();

function writeOutput(key, value) {
  if (!OUTPUT_FILE) {
    console.log(`${key}=${value}`);
    return;
  }
  if (value.includes("\n") || value.includes("}")) {
    appendFileSync(OUTPUT_FILE, `${key}<<EOF\n${value}\nEOF\n`);
  } else {
    appendFileSync(OUTPUT_FILE, `${key}=${value}\n`);
  }
}

let prNumber;
try {
  prNumber = gh(
    `api "repos/${REPO}/issues?state=closed&labels=bundle-sizes&per_page=5&sort=updated&direction=desc" --jq '[.[] | select(.pull_request.merged_at != null)] | .[0].number // empty'`
  );
} catch {
  // gh CLI or API call failed entirely
}

if (!prNumber) {
  console.warn(
    [
      "Warning: No merged PR with the `bundle-sizes` label was found.",
      "",
      "This means either:",
      "  1. The comment chain has not been established yet (first-time setup)",
      "  2. The GitHub API call failed (check GH_TOKEN permissions and network access)",
      "  3. The `bundle-sizes` label has been removed from all previously-merged PRs",
      "",
      "Falling back to bootstrap baseline (bundle-sizes.json).",
      "See docs/bundle-size-monitoring.md for setup instructions.",
    ].join("\n")
  );
  writeOutput("source", "bootstrap");
  process.exit(0);
}

console.log(`Found baseline PR: #${prNumber}`);

const commentBody = gh(
  `api "repos/${REPO}/issues/${prNumber}/comments" --jq '[.[] | select(.user.login == "github-actions[bot]") | select(.body | contains("bundle-sizes-comment"))] | .[0].body // empty'`
);

const match = commentBody.match(/<!-- bundle-sizes-data-v1: ({.*?}) -->/);

if (!match) {
  console.warn(
    [
      `Warning: Found baseline PR #${prNumber} but could not parse the data block`,
      "from its bot comment. The comment may have been edited or deleted.",
      "",
      `Check PR #${prNumber}'s comments for a github-actions[bot] comment`,
      "containing a <!-- bundle-sizes-data-v1: {...} --> block.",
      "",
      "Falling back to bootstrap baseline (bundle-sizes.json).",
    ].join("\n")
  );
  writeOutput("source", "bootstrap");
  process.exit(0);
}

writeOutput("source", "comment-chain");
writeOutput("data", match[1]);
