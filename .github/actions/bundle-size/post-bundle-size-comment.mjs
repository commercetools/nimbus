#!/usr/bin/env node

/**
 * Posts or updates a sticky bundle size comment on a pull request.
 *
 * Reads the JSON output from check-bundle-size.mjs, formats a markdown table,
 * and creates or updates the bot comment on the PR. The comment includes a
 * machine-readable data block that serves as the baseline for future PRs.
 *
 * Usage:
 *   node .github/actions/bundle-size/post-bundle-size-comment.mjs <json-result-file>
 *
 * Environment variables:
 *   GITHUB_REPOSITORY   owner/repo (set by Actions)
 *   GH_TOKEN            GitHub token for API access
 *   PR_NUMBER           Pull request number to comment on
 */

import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";

const REPO = process.env.GITHUB_REPOSITORY;
const PR_NUMBER = process.env.PR_NUMBER;
const JSON_FILE = process.argv[2];

if (!JSON_FILE) {
  console.error("Usage: post-bundle-size-comment.mjs <json-result-file>");
  process.exit(1);
}

if (!PR_NUMBER) {
  console.error("PR_NUMBER environment variable is required.");
  process.exit(1);
}

function gh(args) {
  return execSync(`gh ${args}`, {
    encoding: "utf-8",
    stdio: ["pipe", "pipe", "pipe"],
  }).trim();
}

const data = JSON.parse(readFileSync(JSON_FILE, "utf-8"));

const lines = [];
lines.push("<!-- bundle-sizes-comment -->");
lines.push("## Bundle Size Report");
lines.push("");
lines.push("| Package | Format | Current | Baseline | Delta | Status |");
lines.push("|---------|--------|--------:|---------:|------:|--------|");

for (const [pkg, formats] of Object.entries(data.packages)) {
  const info = formats.dist;
  const current =
    info.current != null ? (info.current / 1024).toFixed(1) + " KB" : "—";
  const baseline =
    info.baseline != null ? (info.baseline / 1024).toFixed(1) + " KB" : "—";
  const delta =
    info.delta_pct != null
      ? (info.delta_pct >= 0 ? "+" : "") + info.delta_pct.toFixed(1) + "%"
      : info.status;
  const icon =
    info.status === "ok"
      ? ":white_check_mark:"
      : info.status === "fail"
        ? ":x:"
        : info.status === "approved"
          ? ":warning:"
          : ":new:";
  lines.push(
    `| ${pkg} | dist | ${current} | ${baseline} | ${delta} | ${icon} ${info.status} |`
  );
}

lines.push("");
lines.push(`Baseline source: **${data.baseline_source}**`);
if (data.has_failures) {
  lines.push("");
  lines.push("> :x: **One or more packages exceeded their size budget.**");
  lines.push(
    "> To approve this increase, apply the `bundle-size-approved` label and re-run CI."
  );
}

const sizes = {};
for (const [pkg, formats] of Object.entries(data.packages)) {
  sizes[pkg] = { dist: formats.dist.current };
}
lines.push("");
lines.push(`<!-- bundle-sizes-data-v1: ${JSON.stringify(sizes)} -->`);

const bodyFile = "/tmp/comment-body.txt";
writeFileSync(bodyFile, lines.join("\n"));

const existingCommentId = gh(
  `api "repos/${REPO}/issues/${PR_NUMBER}/comments" --jq '[.[] | select(.user.login == "github-actions[bot]") | select(.body | contains("bundle-sizes-comment"))] | .[0].id // empty'`
);

if (existingCommentId) {
  gh(
    `api --method PATCH "repos/${REPO}/issues/comments/${existingCommentId}" -F body=@${bodyFile}`
  );
  console.log(`Updated existing comment #${existingCommentId}`);
} else {
  gh(
    `api --method POST "repos/${REPO}/issues/${PR_NUMBER}/comments" -F body=@${bodyFile}`
  );
  console.log("Posted new comment");
}
