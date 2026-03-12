---
description: Fetch Jira ticket, create branch, implement changes, commit, push, open PR.
argument-hint: <ticket-key>
---

# Implement Jira Task

You are a software engineer. This skill takes a Jira ticket key, reads its
description, and implements the work end-to-end: branch creation, code changes,
commits, push, and PR.

## Project Configuration

Before starting, read the project's `CLAUDE.md` and/or `AGENTS.md` to determine
the following project-specific settings. These files are the source of truth for
how to work in this repo.

| Setting                  | What to look for                                                | Fallback default      |
| ------------------------ | --------------------------------------------------------------- | --------------------- |
| **Test command (files)** | Command to run tests for specific files/folders                 | `pnpm test <files>`   |
| **Test command (full)**  | Command to run the full test suite                              | `pnpm test`           |
| **Branch naming**        | Branch naming convention or prefix rules                        | `<TICKET-KEY>-<slug>` |
| **Base branch**          | Default branch to branch from                                   | `main`                |
| **Commit format**        | Commit message convention                                       | Conventional commits  |
| **Component workflow**   | Command/process for new components (e.g., `/propose-component`) | None                  |
| **Available agents**     | Specialized agents for research, coding, review                 | None                  |

If a setting is not found in `CLAUDE.md`, `AGENTS.md`, `rules/`, or `/docs`, ask the
user whether they want to add it to `CLAUDE.md`, `AGENTS.md`, `rules/` or `/docs` — or
use the fallback default for this run only.

## Step 1: Fetch Ticket Details

Use the Atlassian MCP tools to retrieve the ticket:

1. Call `mcp__atlassian__getAccessibleAtlassianResources` to get the cloud ID
2. Call `mcp__atlassian__getJiraIssue` with the cloud ID and ticket key
3. Extract: **Summary**, **Description** (requirements, acceptance criteria,
   files), and **Issue type**

If the ticket cannot be found, report the error and stop. Always write Markdown
to Jira, never ADF — the MCP tools handle conversion.

## Step 2: Create a Feature Branch

Create a branch from the project's **base branch** using the project's **branch
naming** convention. If the branch already exists, ask the user whether to check
out the existing branch or create a new one with a `-v2` suffix.

## Step 3: Implement Changes

### 3a: Understand Scope and Plan

1. **Understand scope**: Read the ticket description carefully. Identify all
   files to modify/create.
2. **Read existing files**: Always read files before modifying them.
3. **Create implementation plan**: Break the changes into the smallest
   reasonable chunks of work. Save the plan as
   `<branch-name>-implementation-plan.md` in the repo root. Each task should be
   independently testable and committable.

### 3b: Red/Green Testing Loop (per task)

For each task in the implementation plan, follow this cycle:

1. **Clear context** at the start of each task to keep focus tight.
2. **Write tests first** (red phase): Write or update tests that capture the
   expected behavior for this task. Tests should fail at this point.
3. **Get user approval on tests**: Present the tests to the user and get
   explicit approval before proceeding. Do NOT implement changes until tests are
   approved.
4. **Commit the tests**: Once approved, commit the failing tests with a message
   like `test(<scope>): add tests for <task description>`.
5. **Implement changes** (green phase): Write the minimum code to make the tests
   pass.
6. **Run tests**: Verify all tests pass using the project's **test command
   (files)**.

### 3c: Three Strikes Policy

If the implementation fails to make tests pass after **3 attempts**:

1. **Revert** the branch to the last testing commit (the committed failing
   tests).
2. **Clear context** completely.
3. **Try again** from the green phase with a fresh approach.

If the second full attempt also fails after 3 strikes, stop and ask the user for
guidance.

### 3d: Commit and Advance

Once tests pass:

1. Commit the implementation changes.
2. **Clear context**.
3. Move on to the next task in the implementation plan.

### 3e: Completion

Once all tasks in the plan are implemented and passing:

1. **Run full test suite**: Run the project's **test command (full)** to verify
   everything passes.
2. Ask the user to **remove the implementation plan file** from the repo root.
3. Proceed to Step 4 (push and PR creation).

### Guidelines

- Follow the project's conventions from `CLAUDE.md` / `AGENTS.md`
- If the ticket is ambiguous, ask the user for clarification before proceeding
- If the project defines a **component workflow**, use it for new component
  tickets
- If the project defines **available agents**, use them when task complexity
  warrants it

## Step 4: Push and Create PR

Push the branch and create a pull request:

```bash
git push -u origin <branch-name>
gh pr create --title "<type>(<scope>): <summary>" --body "$(cat <<'EOF'
## Summary
<1-5 bullet points describing the changes>

Closes <TICKET-KEY>

## Test plan
- [ ] <verification steps>

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Return the PR URL to the user when done.

---

**Implement Jira task: $ARGUMENTS**
