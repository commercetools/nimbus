---
description:
  Create Jira tickets from a plan or spec, with predecessor/successor dependency
  links. Supports creating tickets under an epic, labeling by phase, and
  generating a bulk link script for dependencies.
argument-hint: <epic-key> [plan-file-path] [--dry-run]
---

# Jira Ticket Creation Skill

You are a project planning specialist. This skill creates Jira tickets from a
structured plan document, assigns them under a parent epic, and generates
dependency links between them.

## Overview

Given a plan (markdown file, OpenSpec proposal, or inline description), this
skill will:

1. Parse the plan into discrete tickets with descriptions and acceptance
   criteria
2. Create all tickets in Jira under a specified epic
3. Generate a shell script to create predecessor/successor dependency links

## Mode Detection

Parse the request to determine the operation:

- **create** - Parse plan, create tickets, generate link script
- **dry-run** - Parse plan, output ticket list and dependency map without
  creating anything

If no mode is specified, default to **create**.

## Required Inputs

1. **Epic key** (required) - The Jira epic to parent all tickets under (e.g.,
   `CRAFT-2126`)
2. **Plan source** (required) - One of:
   - A file path to a markdown plan
   - An OpenSpec proposal path
   - Inline description from the user
3. **Project key** (optional) - Defaults to the epic's project key

## Step 1: Parse the Plan into Tickets

You MUST extract from the plan:

- **Tickets**: Each discrete unit of work becomes a ticket
- **Dependencies**: Which tickets must be completed before others
- **Phases/labels**: Groupings for filtering (e.g., "phase-1", "phase-2")
- **Issue types**: Task (infrastructure/setup), Story (user-facing features),
  Spike (research/exploration)

### Ticket Structure

Each ticket MUST have:

| Field       | Required | Description                                                 |
| ----------- | -------- | ----------------------------------------------------------- |
| summary     | Yes      | Short title, prefixed with feature area                     |
| description | Yes      | Markdown body with scope and acceptance criteria            |
| issueType   | Yes      | Task, Story, or Spike                                       |
| labels      | Yes      | Feature label + phase label (e.g., `nimbus-mcp`, `phase-1`) |
| component   | No       | Jira component if applicable                                |

### Description Template

Every ticket description MUST follow this structure:

```markdown
[Scope description — what needs to be built/done]

- Bullet points with specific deliverables
- Include file paths, API signatures, or config details where known

**Acceptance:**

- Concrete, verifiable acceptance criteria
- Testable conditions (not vague "works correctly")
```

You MUST NOT include:

- Estimates (unless the user explicitly asks)
- Assignees (unless the user explicitly asks)
- Sprint assignments

## Step 2: Identify Dependencies

Analyze the plan for sequencing relationships:

### Dependency Types

| Relationship    | Jira link meaning                 | When to use                          |
| --------------- | --------------------------------- | ------------------------------------ |
| Sequential      | A is predecessor of B             | B cannot start until A completes     |
| Data dependency | A is predecessor of B             | B needs output/artifacts from A      |
| Fan-out         | A is predecessor of B, C, D       | Multiple tickets depend on one       |
| Fan-in          | A, B, C are all predecessors of D | One ticket needs all others complete |

### What NOT to Link

- Tickets that CAN be done in parallel — no link needed
- Soft preferences ("nice to have X before Y") — only link hard dependencies
- Cross-phase dependencies where the phase boundary already implies ordering

### Output: Dependency Table

Create a table mapping all dependencies:

```markdown
| Predecessor | Successor  | Reason |
| ----------- | ---------- | ------ |
| CRAFT-XXXX  | CRAFT-YYYY | [why]  |
```

## Step 3: Create Tickets in Jira

### Jira MCP Tool Usage

Use `mcp__atlassian__createJiraIssue` for each ticket:

```
cloudId: "commercetools.atlassian.net"
projectKey: <derived from epic>
issueTypeName: "Task" | "Story" | "Spike"
parent: <epic-key>
summary: "<prefix>: <title>"
description: <markdown description>
additional_fields:
  labels: [<feature-label>, <phase-label>]
  components: [{"id": "<component-id>"}]  # if applicable
```

### Execution Strategy

- You MUST create tickets in parallel batches (up to 9 per batch) for efficiency
- You MUST track the returned CRAFT-XXXX keys for each ticket
- You MUST map plan ticket IDs to actual Jira keys for the dependency step
- You SHOULD create tickets in rough dependency order (foundations first) so the
  key sequence is intuitive

### Known Limitations

The Atlassian MCP tool does NOT support creating issue links. The `issuelinks`
field requires the Jira REST API `update` mechanism, which the MCP tool's
`fields` parameter does not expose. This is a
[known limitation](https://community.atlassian.com/forums/Atlassian-Remote-MCP-Server/Using-MCP-how-do-you-Link-two-tickets-together-creation-or-edit/td-p/3064213).

## Step 4: Generate Dependency Link Script

Since the MCP tool cannot create issue links, generate a shell script that uses
the Jira REST API directly.

### Link Type Discovery

The script MUST first query available link types from the instance:

```bash
curl -s \
  -H "Authorization: Basic $AUTH" \
  "$JIRA_HOST/rest/api/3/issueLinkType"
```

### Jira REST API Direction Semantics (CRITICAL)

The Jira REST API `outwardIssue`/`inwardIssue` fields have **unintuitive
semantics**. The direction is:

- `inwardIssue` = the **predecessor** (the ticket done first)
- `outwardIssue` = the **successor** (the ticket done after)

This means for a link type with `outward: "is predecessor of"` and
`inward: "is successor of"`:

- `inwardIssue` displays the **outward** label ("is predecessor of")
- `outwardIssue` displays the **inward** label ("is successor of")

### Preferred Link Type

Use the **predecessor/successor** link type, NOT "Blocks". Predecessor/successor
conveys sequencing; "Blocks" implies a hard impediment.

Common Jira type names for predecessor/successor:

| Type name             | outward               | inward               |
| --------------------- | --------------------- | -------------------- |
| `dependency`          | is predecessor of     | is successor of      |
| `Sequence`            | is predecessor of     | is successor of      |
| `Gantt: finish-start` | has to be done before | has to be done after |

The script SHOULD default to `dependency` (the most common name at
commercetools) and accept an override via environment variable.

### Script Template

Generate the script at `scripts/jira-link-{feature}.sh`:

```bash
#!/usr/bin/env bash
# Creates predecessor/successor links for {feature} tickets.
#
# Usage:
#   JIRA_EMAIL="you@example.com" JIRA_API_TOKEN="token" bash scripts/jira-link-{feature}.sh
#
# Get an API token at: https://id.atlassian.com/manage-profile/security/api-tokens

set -euo pipefail

JIRA_HOST="https://commercetools.atlassian.net"
LINK_API="$JIRA_HOST/rest/api/3/issueLink"

if [[ -z "${JIRA_EMAIL:-}" || -z "${JIRA_API_TOKEN:-}" ]]; then
  echo "Error: Set JIRA_EMAIL and JIRA_API_TOKEN environment variables."
  exit 1
fi

AUTH=$(printf '%s:%s' "$JIRA_EMAIL" "$JIRA_API_TOKEN" | base64)
LINK_TYPE="${JIRA_LINK_TYPE:-dependency}"

create_link() {
  local predecessor="$1"
  local successor="$2"
  local reason="$3"

  local status
  status=$(curl -s -o /dev/null -w "%{http_code}" \
    -X POST "$LINK_API" \
    -H "Authorization: Basic $AUTH" \
    -H "Content-Type: application/json" \
    -d "{
      \"type\": { \"name\": \"$LINK_TYPE\" },
      \"inwardIssue\": { \"key\": \"$predecessor\" },
      \"outwardIssue\": { \"key\": \"$successor\" }
    }")

  if [[ "$status" == "201" ]]; then
    echo "  OK  $predecessor → $successor ($reason)"
  else
    echo "  FAIL[$status]  $predecessor → $successor ($reason)"
  fi
}

# --- Links ---
# create_link PREDECESSOR SUCCESSOR "reason"
```

### Script Requirements

- The script MUST be executable (`chmod +x`)
- The script MUST print a summary count at the end
- The script MUST clearly label each section of links
- The script SHOULD include a `--cleanup` flag to remove links from a prior bad
  run (query each ticket's links, filter by type, DELETE each link ID)

## Step 5: Update Plan Document

After creating tickets, you MUST update the plan/tickets markdown file to:

- Replace placeholder IDs with actual CRAFT-XXXX keys
- Include the dependency table with real keys
- Note which tickets are fully independent (no predecessors or successors)

## Validation Checklist

Before declaring done, verify:

- [ ] All tickets created with correct parent epic
- [ ] All tickets have labels and component (if applicable)
- [ ] All tickets have acceptance criteria in description
- [ ] Dependency table uses real CRAFT keys
- [ ] Link script generated with correct direction (`inwardIssue` = predecessor)
- [ ] Link script uses `dependency` type (not `Blocks`)
- [ ] Link script is executable
- [ ] Plan document updated with real CRAFT keys
- [ ] Independent tickets clearly identified

## Error Recovery

### Wrong link direction created

If links are created backwards (predecessor shows "is successor of"):

1. Run the script with `--cleanup` flag to delete bad links
2. Verify the `create_link` function uses `inwardIssue` for predecessor
3. Re-run the script

### Link type not found (404)

1. Check the link type discovery output at the top of the script
2. Set `JIRA_LINK_TYPE` env var to the correct type name
3. Common alternatives: `Sequence`, `Gantt: finish-start`, `Gantt Dependency`

### MCP tool returns "Bad Request" for issue links

This is expected. The Atlassian MCP tool does not support the `update` mechanism
needed for issue links. Use the generated shell script instead.

## RFC 2119 Key Words

The key words "MUST", "MUST NOT", "SHOULD", "SHOULD NOT", and "MAY" in this
document are to be interpreted as described in RFC 2119.

---

**Execute ticket creation for: $ARGUMENTS**
