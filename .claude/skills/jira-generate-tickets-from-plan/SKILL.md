---
description: Create Jira tickets from a plan or spec, with dependency links, epic parenting, and phase labels.
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
3. Create predecessor/successor dependency links via the Atlassian MCP

## Mode Detection

Parse the request to determine the operation:

- **create** - Parse plan, create tickets + dependency links
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

| Field       | Required | Description                                               |
| ----------- | -------- | --------------------------------------------------------- |
| summary     | Yes      | Short title — see Phase Title Format below                |
| description | Yes      | Markdown body with scope and acceptance criteria          |
| issueType   | Yes      | Task, Story, or Spike                                     |
| labels      | Yes      | Feature label + phase-task label — see Phase Labels below |
| component   | No       | Jira component if applicable                              |

### Phase Title Format

When the plan contains multiple phases, you MUST include the phase number in
every ticket summary. The format is:

```
{Feature Area} Phase {N}: {concise description of deliverables}
```

**Examples:**

- `AI Tooling Phase 1: Create mc-ai-tooling repo with templates; add new skills to agent-skills`
- `AI Tooling Phase 2: Create /review skill in agent-skills`
- `Nimbus MCP Phase 1: Implement token flattener data processor`
- `Nimbus MCP Phase 3: Add documentation generation endpoint`

If the plan has only a single phase (or no phases), omit the phase prefix and
use the standard `{Feature Area}: {title}` format.

### Phase Labels

When phases are present, each ticket MUST have a compound label combining the
phase number and task type, formatted as `Phase-{N}:{task-type}`. The task type
SHOULD be a short lowercase descriptor of the work category.

**Examples:**

- `Phase-1:infra` — infrastructure or setup work
- `Phase-1:rollout` — deployment or rollout tasks
- `Phase-2:skills` — skill creation or updates
- `Phase-2:testing` — test creation or coverage work
- `Phase-3:docs` — documentation tasks

Each ticket MUST also retain the feature-area label (e.g., `nimbus-mcp`,
`ai-tooling`) alongside the phase-task label.

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

## Step 3: User Approval (REQUIRED)

Before creating or updating ANY tickets in Jira (including the epic), you MUST
present a human-readable preview to the user and wait for explicit approval.

### Preview Format

Display each ticket in a clear, scannable format:

```markdown
## Ticket Preview — {N} tickets under {EPIC-KEY}

### 1. [{issueType}] {summary}

**Labels:** {label1}, {label2}
**Dependencies:** {predecessor tickets, or "None"}

{description text — full scope and acceptance criteria}

---

### 2. [{issueType}] {summary}

...
```

### Dependency Summary

After the ticket list, include the dependency table:

```markdown
## Dependency Map

| #   | Predecessor | Successor | Reason |
| --- | ----------- | --------- | ------ |
| 1   | Ticket 1    | Ticket 3  | [why]  |
```

### Approval Gate

- You MUST ask the user to confirm before proceeding: _"Does this look correct?
  I'll create these tickets once you approve."_
- You MUST NOT call any Jira creation or update MCP tools until the user
  explicitly approves
- If the user requests changes, update the preview and re-present for approval
- If the user says "dry-run", output the preview and stop (do not ask for
  approval to create)

## Step 4: Create Tickets in Jira

### Description Format (CRITICAL)

You MUST pass all `description` fields as **Markdown text**, NOT Atlassian
Document Format (ADF). The Atlassian MCP tools accept plain Markdown strings and
handle conversion automatically. Sending ADF will result in malformed ticket
descriptions.

### Jira MCP Tool Usage

Use `mcp__atlassian__createJiraIssue` for each ticket:

```
cloudId: "commercetools.atlassian.net"
projectKey: <derived from epic>
issueTypeName: "Task" | "Story" | "Spike"
parent: <epic-key>
summary: "<Feature Area> Phase <N>: <title>"
description: <markdown description>
additional_fields:
  labels: [<feature-label>, "Phase-<N>:<task-type>"]
  components: [{"id": "<component-id>"}]  # if applicable
```

### Execution Strategy

- You MUST create tickets in parallel batches (up to 9 per batch) for efficiency
- You MUST track the returned CRAFT-XXXX keys for each ticket
- You MUST map plan ticket IDs to actual Jira keys for the dependency step
- You SHOULD create tickets in rough dependency order (foundations first) so the
  key sequence is intuitive

## Step 5: Create Dependency Links

After all tickets are created with their real Jira keys, create dependency links
using `mcp__atlassian__createIssueLink`.

### Preferred Link Type

Use the `dependency` link type, NOT "Blocks". Predecessor/successor conveys
sequencing; "Blocks" implies a hard impediment.

At commercetools, the `dependency` type has:

- outward: "is predecessor of"
- inward: "is successor of"

### Direction Semantics (CRITICAL)

The `mcp__atlassian__createIssueLink` tool uses these semantics:

- `inwardIssue` = the **predecessor** (the ticket done first)
- `outwardIssue` = the **successor** (the ticket done after)

### Creating Links

For each dependency in the dependency table, call
`mcp__atlassian__createIssueLink`:

```
cloudId: "commercetools.atlassian.net"
type: "dependency"
inwardIssue: <predecessor-key>    # the ticket done first
outwardIssue: <successor-key>     # the ticket done after
```

### Execution Strategy

- Create all dependency links in parallel for efficiency
- Log each link created: "predecessor → successor (reason)"
- Report a summary: "N/M links created successfully"
- If a link fails, log the error and continue with remaining links

## Step 6: Update Plan Document

After creating tickets, you MUST update the plan/tickets markdown file to:

- Replace placeholder IDs with actual CRAFT-XXXX keys
- Include the dependency table with real keys
- Note which tickets are fully independent (no predecessors or successors)

## Validation Checklist

Before declaring done, verify:

- [ ] User approved the ticket preview before any Jira creation
- [ ] All tickets created with correct parent epic
- [ ] All tickets have labels and component (if applicable)
- [ ] All tickets have acceptance criteria in description
- [ ] Dependency table uses real Jira keys
- [ ] All dependency links created via `mcp__atlassian__createIssueLink`
- [ ] Links use `dependency` type (not `Blocks`)
- [ ] Links use correct direction (`inwardIssue` = predecessor)
- [ ] Plan document updated with real Jira keys
- [ ] Independent tickets clearly identified

## Error Recovery

### Wrong link direction created

If links are created backwards (predecessor shows "is successor of"):

1. Ask the user to manually delete the incorrect links in Jira (there is no MCP
   tool for deleting issue links)
2. Once the bad links are removed, recreate them with `inwardIssue` and
   `outwardIssue` swapped

### Link type not found

1. Call `mcp__atlassian__getIssueLinkTypes` to list available types
2. Use the correct type name from the response
3. Common alternatives: `Sequence`, `Gantt: finish-start`, `Gantt Dependency`

## RFC 2119 Key Words

The key words "MUST", "MUST NOT", "SHOULD", "SHOULD NOT", and "MAY" in this
document are to be interpreted as described in RFC 2119.

---

**Execute ticket creation for: $ARGUMENTS**
