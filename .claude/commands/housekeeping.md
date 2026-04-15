---
description: Update all workspace dependencies to latest minor/patch versions with smart ordering and testing
argument-hint: [group] [dry run] (e.g. "tooling", "react dry run", "all")
---

You are a **Senior DevOps Engineer** tasked with safely updating dependencies in
a pnpm monorepo workspace. Your mission is to update all catalog dependencies in
`pnpm-workspace.yaml` to their latest **minor and patch versions only** (no
major version updates) while maintaining build and test integrity.

## **Command Arguments**

The user can optionally specify which dependency group to update:

- `housekeeping tooling` - Update only tooling dependencies (safest)
- `housekeeping react` - Update only React ecosystem dependencies
- `housekeeping utils` - Update only utility dependencies
- `housekeeping all` or `housekeeping` - Update all dependencies (default)

Append `dry run` to any group to preview changes without modifying anything:

- `housekeeping dry run` - Preview all dependency updates
- `housekeeping tooling dry run` - Preview tooling updates only

**Target Group:** $ARGUMENTS (defaults to "all" if empty)

---

## **Execution Strategy**

### **Phase 1: Git Setup & Pre-flight Checks**

1. **Create Feature Branch:**

   ```bash
   # Create and checkout new branch from main
   # Use YYYYMMDD-HHMM for uniqueness (same timestamp used for changeset filename)
   git checkout main
   git pull origin main
   git checkout -b housekeeping-$(date +%Y%m%d-%H%M)
   ```

2. **Git Status Verification:**
   - Ensure working tree is clean with no uncommitted changes
   - If dirty, halt and ask user to commit or stash changes

3. **Workspace Analysis:**
   - Parse `@pnpm-workspace.yaml` to identify all catalog dependencies
   - Categorize dependencies by risk level and group

### **Phase 2: Dependency Categorization**

Organize dependencies from `pnpm-workspace.yaml` catalogs into these groups **in
order of update priority** (safest first):

**=' TOOLING (Lowest Risk - Update First):**

- Build tools: `typescript`, `vite`, `rollup`, `@babel/core`, `@vitejs/*`
- Linters: `eslint`, `eslint-*`, `prettier`, `@eslint/*`
- Test tools: `vitest`, `@vitest/*`, `playwright`, `@testing-library/*`
- Dev tools: `tsx`, `@preconstruct/cli`, `globals`, `glob`
- Storybook: `storybook`, `@storybook/*`

**=� UTILS (Medium Risk - Update Second):**

- Utility libraries: `lodash`, `@types/lodash`, `@types/node`
- Date/time: `@internationalized/date`
- Any non-React runtime dependencies

**� REACT (Highest Risk - Update Last):**

- **React runtime (FROZEN)**: `react`, `react-dom`, `@types/react`,
  `@types/react-dom` - **DO NOT UPDATE** (consumers control version)
- **Emotion (FROZEN)**: `@emotion/react` - **DO NOT UPDATE** (peer dependency,
  consumers control version)
- **UI frameworks (updateable)**: `@chakra-ui/*`, `next-themes`
- **React Aria (updateable)**: `react-aria*`, `react-stately`, `@react-aria/*`

### **Phase 3: Progressive Updates with Safety Checks**

For each dependency group (or the specified target group):

1. **Fetch Latest Versions:**

   ```bash
   # Check current and latest versions for each dependency
   pnpm view [package-name] version
   ```

2. **Version Comparison:**
   - You MUST only update to latest minor/patch versions (no major bumps)
   - You MUST respect semver constraints (e.g., `^7.28.0` can go to `^7.29.1`
     but not `^8.0.0`)
   - **Critical Constraint on React Runtime**: Since this is a React UI library,
     the runtime packages `react`, `react-dom`, and `@emotion/react` are frozen
     at their current versions. You MUST NOT update these packages because UI
     library consumers must control these peer dependency versions. However, you
     CAN and SHOULD update `@types/react`, `@types/react-dom`, `@chakra-ui/*`,
     and React Aria packages to their latest minor/patch versions. If any
     package update would require upgrading `react`, `react-dom`, or
     `@emotion/react` runtime packages, you MUST immediately halt and report the
     conflict.

3. **Update Workspace Catalog:**
   - Modify `pnpm-workspace.yaml` catalog entries with new versions
   - Update one group at a time

4. **Install & Verify:**

   ```bash
   pnpm install --lockfile-only  # Update lockfile
   pnpm build:packages           # Verify build integrity
   pnpm test                     # Verify test suite passes
   ```

5. **Safety Checkpoint:**
   - If build or tests fail, immediately rollback the group's updates
   - Create checkpoint git commit after each successful group:
     ```bash
     git add pnpm-workspace.yaml pnpm-lock.yaml
     git commit -m "chore(deps): update [GROUP] dependencies"
     ```
   - Continue to next group only if current group succeeds

### **Phase 4: Final Verification & Pull Request**

1. **Complete Build & Test:**

   ```bash
   pnpm build      # Full build including docs
   pnpm test       # Complete test suite
   ```

2. **Final Commit:**

   ```bash
   # Commit any remaining changes from final build/test
   git add -A
   git commit -m "chore(deps): finalize dependency updates and regenerate lockfile" --allow-empty
   ```

3. **Generate Update Summary:**
   - List all updated packages with before/after versions
   - Report any packages that were skipped (major version changes)
   - Identify packages that are already at latest versions
   - Display total update count by category
   - Note: Keep frozen packages and "already at latest" packages separate in the
     PR body

4. **Permission check before push:**

   Run `gh repo view --json viewerPermission --jq '.viewerPermission'`. If the
   result is `READ`, skip push and PR — print the exact `git push` and
   `gh pr create` commands for the user to run manually, then stop.

5. **Create Pull Request:**

   **Important:** Replace all placeholder values in the PR body template:
   - `[package]: [old] → [new]` with actual package updates
   - `[version]` with actual frozen versions
   - `[X]` with actual counts (packages, tests)
   - `[List ...]` sections with actual lists
   - Remove "Additional Changes" section if no non-dependency changes were made

   ```bash
   # Push branch to origin
   git push -u origin <current-branch-name>

   # Create PR using GitHub CLI
   gh pr create \
     --title "chore(deps): update workspace dependencies to latest minor/patch versions" \
     --body "$(cat <<'EOF'
   ## Summary

   This PR updates workspace catalog dependencies to their latest minor and patch versions while maintaining compatibility and respecting version constraints.

   ## 🔧 Tooling Dependencies Updated

   [List all tooling packages that were updated with before → after versions]

   **Build & Development Tools:**
   - [package]: [old] → [new] (minor/patch)

   **Storybook Ecosystem:**
   - [package]: [old] → [new]

   **Additional Lockfile Updates:**
   - [package]: [old] → [new]

   ## ⚛️ React Ecosystem Status

   **⚠️ Frozen Packages (Consumer Control)**

   As a UI library, consumers must control these peer dependency versions:
   - `react`: [version]
   - `react-dom`: [version]
   - `@types/react`: [version] (frozen to match React runtime)
   - `@types/react-dom`: [version] (frozen to match React runtime)
   - `@emotion/react`: [version]

   **✅ Already at Latest**

   These packages are at their latest versions:
   - [List packages that are current but updateable in future]

   ## 📊 Update Strategy

   Dependencies were updated in risk-ordered groups with validation checkpoints:

   1. **Tooling Group** (lowest risk): Build tools, linters, test frameworks
   2. **React Group** (controlled): All packages either frozen or already current
   3. **Utils Group** (if updated): Utility libraries

   Each group was:
   - ✅ Updated independently
   - ✅ Verified with `pnpm build:packages`
   - ✅ Tested with full suite (all tests passed)
   - ✅ Committed as checkpoint

   ## 🧪 Testing

   - ✅ **Build integrity verified**: `pnpm build:packages` passes
   - ✅ **Full test suite passes**: `pnpm test` ([X] tests, all passed)
   - ✅ **Complete build passes**: `pnpm build` (includes docs)
   - ✅ **No breaking changes detected**

   ## 📝 Additional Changes

   [List any non-dependency changes, such as formatting updates]

   ## 📝 Summary

   - ✅ **[X] packages updated** (tooling/utils/etc.)
   - ⏸️ **5 packages frozen** (React core + types + Emotion)
   - ✅ **[X] packages already current** (Chakra UI, React Aria, etc.)
   - ✅ **0 packages failed**
   - ✅ **100% test pass rate** ([X]/[X] tests)

   ## 🔍 Review Notes

   This is a low-risk update focused on:
   1. **Patch updates** for bug fixes and security improvements
   2. **Minor updates** for new features (backward compatible)
   3. **React packages frozen** to allow consumer control
   4. **All changes backward compatible** within semver constraints

   ---

   🤖 Generated with [Claude Code](https://claude.ai/claude-code)
   EOF
   )"
   ```

6. **Changeset Creation (Required When Published Packages Are Affected):**

   After all updates are committed, determine if any updated dependencies are
   used by published packages. The published packages in this repo are:
   `@commercetools/nimbus`, `@commercetools/nimbus-tokens`,
   `@commercetools/nimbus-icons`, and
   `@commercetools/nimbus-design-token-ts-plugin` (see `.changeset/config.json`
   `fixed` array).

   **When to create a changeset:**
   - If ANY updated dependency appears in a published package's `dependencies`
     or `peerDependencies` (not just `devDependencies`), you MUST create a
     changeset
   - The `react` and `utils` catalog groups almost always affect published
     packages since they contain runtime dependencies
   - The `tooling` catalog group typically does NOT require a changeset since
     those are devDependencies only — but verify by checking if any tooling
     package appears in a published package's `dependencies`

   **How to create the changeset:**

   Create a file with a **unique, timestamped name** to avoid collisions when
   the command runs multiple times before a release. Reuse the same timestamp
   from the branch name (e.g. if the branch is `housekeeping-20260415-0912`, the
   changeset file is `.changeset/housekeeping-deps-20260415-0912.md`). This
   ensures the branch and changeset always correspond, and uniqueness is
   guaranteed even if the command runs twice in the same day.

   Use the following format for the file content:

   ```markdown
   ---
   "@commercetools/nimbus": patch
   ---

   Update runtime dependencies: [list the key updated packages and version
   bumps]
   ```

   - Use `patch` level since minor/patch dependency bumps are backward
     compatible
   - Only list the package(s) that actually have affected runtime dependencies
     in the frontmatter (e.g., if only `@commercetools/nimbus` uses the updated
     deps, only list that one)
   - Include the changeset in the final commit before pushing

---

## **Safety Features & Error Handling**

### **Rollback Procedure:**

If any group fails build/tests:

1. Restore `pnpm-workspace.yaml` from git:
   ```bash
   git checkout HEAD -- pnpm-workspace.yaml
   ```
2. Run `pnpm install` to restore lockfile
3. Reset to last successful commit:
   ```bash
   git reset --hard HEAD~1  # Only if mid-group failure
   ```
4. Report which specific group failed
5. Suggest updating that group manually or investigating failures

### **Logging:**

- Log each step with timestamps
- Show current vs. target versions for each update
- Display build/test command outputs
- Maintain detailed audit trail

### **Dry Run Mode:**

Activated by including `dry run` in the arguments (e.g. `housekeeping dry run`
or `housekeeping tooling dry run`). When active, show:

- Which packages would be updated
- Current vs. target versions
- Update order and grouping
- No actual changes made

---

## **Example Output Format:**

```
<� HOUSEKEEPING: Dependency Updates Starting...

 Pre-flight checks passed
=� Found 23 catalog dependencies across 3 groups

=' TOOLING GROUP (12 packages):
   typescript: 5.8.3 � 5.8.4
   eslint: 9.34.0 � 9.35.1
   Build & tests passed 

=� UTILS GROUP (3 packages):
   lodash: 4.17.21 � 4.17.22
   Build & tests passed 

� REACT GROUP (5 packages updated, 3 frozen):
   @types/react: 19.1.8 → 19.1.16
   @types/react-dom: 19.1.6 → 19.1.9
   @chakra-ui/react: 3.26.0 → 3.27.2
   react-aria: 3.42.0 → 3.43.2
   ⏸ react: 19.0.0 (FROZEN)
   ⏸ react-dom: 19.0.0 (FROZEN)
   ⏸ @emotion/react: 11.14.0 (FROZEN)
   Build & tests passed 

=� SUMMARY:
-  23 packages updated successfully
- � 0 packages skipped (major versions)
- � 0 packages failed
- =R Total time: 3m 42s

🔧 Housekeeping complete! PR is ready for review.
```

---

**Remember:** Safety first! You MUST always verify builds and tests between
dependency groups. If anything fails, you MUST rollback immediately and
investigate before proceeding.

## RFC 2119 Key Words

- **MUST** / **REQUIRED** / **SHALL** - Absolute requirement
- **MUST NOT** / **SHALL NOT** - Absolute prohibition
- **SHOULD** / **RECOMMENDED** - Should do unless valid reason not to
- **SHOULD NOT** / **NOT RECOMMENDED** - Should not do unless valid reason
- **MAY** / **OPTIONAL** - Truly optional

---

## **Complete Workflow Summary**

The housekeeping command now includes a full git workflow:

1. **🌿 Branch Creation**: Creates `housekeeping-YYYYMMDD-HHMM` branch from main
2. **📝 Incremental Commits**: Each dependency group gets its own commit
3. **🏁 Final Verification**: Complete build and test validation
4. **🚀 Pull Request**: Automatic PR creation with comprehensive summary
5. **🔗 Integration**: Ready-to-review PR with all changes documented

This ensures full traceability of dependency updates and provides a clean review
process for maintainers.
