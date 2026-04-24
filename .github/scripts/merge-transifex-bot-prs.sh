#!/usr/bin/env bash
set -euo pipefail

if [ -z "$PRS" ]; then
  echo "No open Transifex bot PRs found."
  exit 0
fi

git config user.name "ct-changesets[bot]"
git config user.email "ct-changesets[bot]@users.noreply.github.com"

for PR_NUM in $PRS; do
  echo "Processing PR #$PR_NUM..."

  # For workflow_dispatch, check out the PR branch
  if [ "$EVENT_NAME" != "pull_request" ]; then
    BRANCH=$(gh pr view "$PR_NUM" --json headRefName --jq '.headRefName')
    git fetch origin "$BRANCH"
    git checkout "$BRANCH"
  fi

  # Skip if any changed files are not JSON
  NON_JSON=$(gh pr view "$PR_NUM" \
    --json files \
    --jq '[.files[].path | select(endswith(".json") | not)] | length')
  if [ "$NON_JSON" -gt 0 ]; then
    echo "PR #$PR_NUM has non-JSON files. Skipping."
    continue
  fi

  # Skip if any commits are from non-bot authors
  NON_BOT=$(gh pr view "$PR_NUM" \
    --json commits \
    --jq "[.commits[].authors[] | select(.login != \"$TRANSIFEX_BOT_AUTHOR\")] | length")
  if [ "$NON_BOT" -gt 0 ]; then
    echo "PR #$PR_NUM has commits from non-bot authors. Skipping."
    continue
  fi

  # Compile on the PR branch and commit. Since all locale files are immediately seeded with en
  # defaults, no-op is expected for most Tx PRs when new message keys are extracted (i.e. output
  # already exists on main before Tx returns with real translations). This is more of a preventative
  # measure to catch any unexpected changes to compiled output that may arise from changes to the
  # compilation logic or edge cases in the input JSON.
  
  if [ "$DRY_RUN" = "true" ]; then
    echo "Dry run — skipping compile and commit for PR #$PR_NUM."
  else
    pnpm --filter @commercetools/nimbus-i18n build
    git add packages/nimbus/src/components/
    if git diff --cached --quiet; then
      echo "No compiled output changes for PR #$PR_NUM."
    else
      git commit -m "chore(intl): compile translation updates from Transifex"
      git push origin HEAD
      echo "Pushed compiled output to PR #$PR_NUM branch."
    fi
  fi

  # Approve if not already approved
  APPROVED=$(gh pr view "$PR_NUM" \
    --json reviews \
    --jq '[.reviews[] | select(.state == "APPROVED")] | length')
  if [ "$APPROVED" -eq 0 ]; then
    if [ "$DRY_RUN" = "true" ]; then
      echo "Dry run — skipping approval of PR #$PR_NUM."
    else
      gh pr review "$PR_NUM" --approve \
        --body "Auto-approved by merge-transifex-bot-prs workflow."
      echo "Approved PR #$PR_NUM."
    fi
  fi

  # Add audit label and merge
  if [ "$DRY_RUN" = "true" ]; then
    echo "Dry run — skipping label and merge of PR #$PR_NUM."
  else
    gh pr edit "$PR_NUM" --add-label "tx-auto-merge"
    gh pr merge "$PR_NUM" --squash --auto
    echo "Merged PR #$PR_NUM into main."
  fi
done
