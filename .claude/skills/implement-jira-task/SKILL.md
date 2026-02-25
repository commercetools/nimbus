---
description: Fetch a Jira ticket, create a branch, implement changes, commit incrementally, push, and open a PR.
argument-hint: <ticket-key>
---

# Implement Jira Task

You are a software engineer. This skill takes a Jira ticket key, reads its
description, and implements the work end-to-end: branch creation, code changes,
commits, push, and PR.

## Overview

Given a Jira ticket key (e.g., `CRAFT-2118`), this skill will:

1. Fetch the ticket details from Jira
2. Create a feature branch named after the ticket
3. Implement the changes described in the ticket
4. Commit with conventional commit messages referencing the ticket
5. Push the branch and open a pull request

## Step 1: Fetch Ticket Details

Use the Atlassian MCP tools to retrieve the ticket:

1. Call `mcp__atlassian__getAccessibleAtlassianResources` to get the cloud ID
2. Call `mcp__atlassian__getJiraIssue` with the cloud ID and ticket key
3. Extract from the response:
   - **Summary**: ticket title
   - **Description**: full requirements, acceptance criteria, files to modify
   - **Issue type**: Task, Story, Bug, etc.

If the ticket cannot be found, report the error and stop.

## Step 2: Create a Feature Branch

Create a branch from `main` using this naming convention:

```
<TICKET-KEY>-<short-slug>
```

Rules:

- Use the ticket key as prefix (e.g., `CRAFT-2118`)
- Follow with a dash-separated slug derived from the ticket summary
- Keep the slug concise (3-5 words max)
- Use lowercase for the slug portion
- Use dashes (`-`) as separators, never slashes (`/`)

Examples:

- `CRAFT-2118-color-tokens-wcag-docs`
- `CRAFT-1234-add-toast-component`
- `CRAFT-5678-fix-menu-keyboard-nav`

```bash
git checkout -b <branch-name> main
```

## Step 3: Implement Changes

Read the ticket description carefully and implement all requested changes:

1. **Understand scope**: Identify all files to modify/create from the ticket
2. **Read existing files**: Always read files before modifying them
3. **Make changes**: Implement the requirements from the ticket description
4. **Follow conventions**: Use existing code patterns and project standards
5. **Check acceptance criteria**: Verify each criterion from the ticket is met

### Guidelines

- If the ticket references specific files, modify those files
- If the ticket is a documentation change, focus on content accuracy
- If the ticket is a code change, follow the project's component guidelines
- If the ticket is ambiguous, ask the user for clarification before proceeding
- Use the appropriate agents (nimbus-researcher, nimbus-coder, nimbus-reviewer)
  when the task complexity warrants it

## Step 4: Commit Changes

Create commits using conventional commit format:

```
<type>(<scope>): <description>

<body>

<TICKET-KEY>

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

### Commit Cadence

Ask the user to confirm before committing. Commit at these natural checkpoints:

- After each acceptance criterion from the ticket is satisfied
- After a major logical change is implemented (e.g., a new section added, a
  refactor completed, a file restructured)
- Before moving on to a different type of change (e.g., switching from content
  updates to structural reordering)

Do NOT batch all changes into a single commit at the end. Incremental commits
give the user review points and make the PR history easier to follow.

### Commit Rules

- **type**: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, etc.
- **scope**: component or area affected (e.g., `colors`, `button`, `tokens`)
- **description**: concise summary of what changed
- **body**: optional, for additional context on why
- **footer**: always include the ticket key for traceability
- Split logically independent changes into separate commits
- Each commit should be atomic and pass lint/typecheck independently

## Step 5: Push and Create PR

Push the branch and create a pull request:

```bash
git push -u origin <branch-name>
```

Create the PR using `gh pr create` with this format:

```bash
gh pr create --title "<type>(<scope>): <summary>" --body "$(cat <<'EOF'
## Summary
<1-3 bullet points describing the changes>

Closes <TICKET-KEY>

## Test plan
- [ ] <verification steps>

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

### PR Rules

- PR title should match conventional commit format
- Keep the title under 70 characters
- Summary should reference what changed and why
- Include `Closes <TICKET-KEY>` to auto-link the Jira ticket
- Test plan should include concrete verification steps
- Return the PR URL to the user when done

## Validation Checklist

Before declaring done, verify:

- [ ] Ticket details were fetched successfully
- [ ] Branch created from `main` with correct naming
- [ ] All acceptance criteria from the ticket are addressed
- [ ] Commits use conventional format with ticket key
- [ ] Branch pushed to remote
- [ ] PR created with summary, ticket reference, and test plan
- [ ] PR URL provided to the user

## Error Recovery

### Ticket not found

- Verify the ticket key format (e.g., `CRAFT-2118`)
- Check that the Atlassian MCP connection is working
- Ask the user to verify the ticket key

### Branch already exists

- Ask the user if they want to check out the existing branch or create a new one
- If creating new, append a suffix (e.g., `-v2`)

### Push fails

- Check if the remote is accessible
- Verify the branch name doesn't conflict with protected branches
- Report the error to the user

---

**Implement Jira task: $ARGUMENTS**
