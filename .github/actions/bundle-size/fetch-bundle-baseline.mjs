#!/usr/bin/env node

/**
 * Fetches the bundle size baseline from the comment chain.
 *
 * Queries the most recently updated merged PR with the "bundle-sizes" label,
 * extracts the machine-readable data block from the bot comment, and writes
 * the result to GITHUB_OUTPUT for downstream workflow steps.
 *
 * Outputs (via GITHUB_OUTPUT):
 *   source   — "comment-chain" or "bootstrap"
 *   data     — JSON string of baseline sizes (only when source is "comment-chain")
 *
 * Environment variables:
 *   GITHUB_REPOSITORY   owner/repo (set by Actions)
 *   GH_TOKEN            GitHub token for API access
 *   GITHUB_OUTPUT        Path to the output file (set by Actions)
 */

import { execSync } from "node:child_process";
import { appendFileSync } from "node:fs";

const REPO = process.env.GITHUB_REPOSITORY;
const OUTPUT_FILE = process.env.GITHUB_OUTPUT;

function gh(args) {
  return execSync(`gh ${args}`, {
    encoding: "utf-8",
    stdio: ["pipe", "pipe", "pipe"],
  }).trim();
}

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

const prNumber = gh(
  `api "repos/${REPO}/pulls?state=closed&labels=bundle-sizes&per_page=5&sort=updated&direction=desc" --jq '[.[] | select(.merged_at != null)] | .[0].number // empty'`
);

if (!prNumber) {
  console.log(
    "No labeled merged PR found. Using bootstrap baseline (bundle-sizes.json)."
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
    `::warning::Could not parse data block from PR #${prNumber} comment. Falling back to bootstrap file.`
  );
  writeOutput("source", "bootstrap");
  process.exit(0);
}

writeOutput("source", "comment-chain");
writeOutput("data", match[1]);
