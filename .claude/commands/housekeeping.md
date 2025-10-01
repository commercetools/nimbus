---
description: Update all workspace dependencies to latest minor/patch versions with smart ordering and testing
argument-hint: [group] (optional: tooling, react, utils, or all)
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

**Target Group:** $ARGUMENTS (defaults to "all" if empty)

---

## **Execution Strategy**

### **Phase 1: Git Setup & Pre-flight Checks**

1. **Create Feature Branch:**

   ```bash
   # Create and checkout new branch from main
   git checkout main
   git pull origin main
   git checkout -b housekeeping-$(date +%d-%m-%Y)
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
   - Only update to latest minor/patch versions (no major bumps)
   - Respect semver constraints (e.g., `^7.28.0` can go to `^7.29.1` but not
     `^8.0.0`)
   - **CRITICAL: React Runtime Constraint** - Since this is a React UI library,
     the **runtime packages** `react`, `react-dom`, and `@emotion/react` are
     **FROZEN** at their current versions. UI library consumers must control
     these peer dependency versions. However, `@types/react`,
     `@types/react-dom`, `@chakra-ui/*`, and React Aria packages **CAN and
     SHOULD be updated** to their latest minor/patch versions. If any package
     update would require upgrading `react`, `react-dom`, or `@emotion/react`
     runtime packages, **HALT IMMEDIATELY** and report the conflict.

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
   - Display total update count by category

4. **Create Pull Request:**

   ```bash
   # Push branch to origin
   git push -u origin housekeeping-$(date +%d-%m-%Y)

   # Create PR using GitHub CLI
   gh pr create \
     --title "chore(deps): update workspace dependencies to latest minor/patch versions" \
     --body "$(cat <<'EOF'
   ## Summary

   This PR updates workspace dependencies to their latest minor and patch versions while maintaining compatibility.

   ### Updated Dependencies

   [DEPENDENCY_SUMMARY]

   ### Changes Made
   - Updated catalog dependencies in pnpm-workspace.yaml
   - Regenerated pnpm-lock.yaml
   - All builds and tests pass

   ### Testing
   - ✅ Build integrity verified (`pnpm build:packages`)
   - ✅ Full test suite passes (`pnpm test`)
   - ✅ Complete build passes (`pnpm build`)

   🤖 Generated with [Claude Code](https://claude.ai/code)
   EOF
   )"
   ```

5. **Optional Changeset Creation:**
   - Ask if user wants to create a changeset for these updates
   - If yes, generate appropriate changeset entry

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

If user wants to preview changes first, show:

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

**Remember:** Safety first! Always verify builds and tests between dependency
groups. If anything fails, rollback immediately and investigate before
proceeding.

---

## **Complete Workflow Summary**

The housekeeping command now includes a full git workflow:

1. **🌿 Branch Creation**: Creates `housekeeping-DD-MM-YYYY` branch from main
2. **📝 Incremental Commits**: Each dependency group gets its own commit
3. **🏁 Final Verification**: Complete build and test validation
4. **🚀 Pull Request**: Automatic PR creation with comprehensive summary
5. **🔗 Integration**: Ready-to-review PR with all changes documented

This ensures full traceability of dependency updates and provides a clean review
process for maintainers.
