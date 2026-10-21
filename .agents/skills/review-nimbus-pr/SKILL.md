---
name: review-nimbus-pr
description: Review a Nimbus pull request branch against origin/main. Use when asked to review a PR or a branch by name.
---

# Review Nimbus PR

## Input

Optional branch name. Without it, review the branch that is checked out.

## Steps

1. If the user gave a branch name, run `git fetch origin` and check out that
   branch. Otherwise, stay on the current branch.
2. Compare against `origin/main`, not local `main` (local `main` is often
   stale): `git diff origin/main...HEAD`.
3. Follow the `nimbus-review` skill with this diff as the review target.
4. Beyond guideline compliance, also check the changes for accuracy,
   effectiveness, consistency, performance, security posture, and any potential
   for adding bugs, regressions or undue maintenance.
5. For every component the diff touches, run the matching `writing-*` skills in
   `validate` mode (for example `writing-stories validate Button`) and include
   their results in the report.
