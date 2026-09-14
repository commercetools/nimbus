---
description:
  Fix one known bug class across every @commercetools/nimbus-viz chart it hits —
  detect, apply the recorded fix pattern, add the edge-case story, verify,
  commit once per class
argument-hint:
  <bug-class id from packages/nimbus-viz/docs/bug-classes.md> (e.g. BC-1)
allowed-tools: Glob, Grep, Read, Edit, Write, Bash, Agent
---

# /chart:sweep — Cross-chart bug-class sweep

`/chart:introspect` audits one chart at a time. Some findings are not
chart-specific: the same pattern sits in a dozen charts and can be found by a
grep. Those live as rows in `packages/nimbus-viz/docs/bug-classes.md`. This
command fixes one row everywhere it hits, in one commit, so the per-chart loop
does not rediscover the same bug twelve times.

## Input

`$ARGUMENTS` — a bug-class id (`BC-1`). If empty or unknown, print the id and
class columns of `docs/bug-classes.md` and stop.

## Process

### 0. Resolve

Read `packages/nimbus-viz/docs/bug-classes.md`. Find the row for `$ARGUMENTS`
and quote its `detect`, `fix pattern`, and `plausible when` cells verbatim. Read
the reference fix named in the row (the commit or file) so the pattern is
applied the way it was already applied once, not re-invented.

### 1. Pre-flight (single-writer rule)

```bash
git status --porcelain -- packages/nimbus-viz     # must be empty
pnpm --filter @commercetools/nimbus-viz typecheck # baseline must pass
```

If either fails, report and stop.

### 2. Detect

Run the row's `detect` command. Drop files that already use the fix helper named
in the row (e.g. `grep -l "bandByIndex"`). Drop the legitimate exceptions listed
under the row's "Status" entry. Announce the hit list: **"Sweep `BC-n`: N charts
— a, b, c …"**. If the list is empty, say so and stop; nothing to commit.

### 3. Fix each hit

For each chart in the list, in alphabetical order:

1. Apply the fix pattern. Do mechanical edits directly. When the chart's
   structure makes the edit a judgment call (a configurable accessor, a nested
   inner band, a domain that also feeds an overlay), delegate to `nimbus-coder`
   with the row text and the reference fix, and re-review with `nimbus-reviewer`
   at most twice. If it does not converge, leave that chart out, note "open:
   <reason>" for the Status update in Step 5, and continue.
2. Add or extend one `EdgeCase*` story in `{chart}.stories.tsx` that asserts the
   class is fixed — the real behavior, never "did not throw". Use the shared
   mutators in `src/stories/adversarial.ts` (`duplicateLabels`,
   `negateEveryOther`, `allZero`, …) rather than hand-rolling the input. Follow
   `writing-chart-stories` conventions (no `ChartThemeProvider` wrapper,
   distinct `ariaLabel` per instance, `step()` names backed by assertions).
3. Run that chart's stories alone, fast-fail:

   ```bash
   pnpm vitest run --project nimbus-viz-storybook packages/nimbus-viz/src/components/{chart}/{chart}.stories.tsx
   ```

4. If the contract wording changed (e.g. "labels need not be unique", "negative
   values draw below the zero line"), update the chart's `.mdx` "Data shape" and
   "Limitations" per `writing-chart-documentation`.

### 4. Verify the whole package

Same gates as `/chart:introspect` Step 8, whole package, because shared files
are involved:

```bash
pnpm --filter @commercetools/nimbus-viz typecheck
pnpm --filter @commercetools/nimbus-viz test
pnpm --filter @commercetools/nimbus-viz build
pnpm exec eslint <every touched file>
```

Then open `src/selection/registry-invariants.spec.tsx` and delete the
`KNOWN_GAPS` entries for the charts this sweep fixed. Their tests run as
`it.fails` while listed, so a fixed chart left in the list fails the unit
project loudly — that is the reminder, not a bug. Re-run the unit project.

If any gate fails: do not commit. Report verbatim; fix or stop.

### 5. Record

- `docs/bug-classes.md` "Status": move the fixed charts to "fixed", list any
  left open with the reason.
- `TODO.md`: if a chart's fix completes a phase item for it, append the chart to
  that item's "done:" list. Do not restructure the file.

### 6. Commit — one commit per class

Same discipline as `/chart:introspect` Step 11: explicit pathspec on both
`git add` and `git commit`, confirm with `git show --stat HEAD`.

```bash
git add -- <every touched file>
git diff --staged --stat
git commit -m "$(cat <<'EOF'
fix(nimbus-viz): BC-n <class> across N charts

<which charts, which helper, which stories were added, which
KNOWN_GAPS entries were removed, what stays open and why>
EOF
)" -- <the same files>
git show --stat HEAD
```

### 7. Report

Hits, fixed, left open (with reasons), and the commit hash.
