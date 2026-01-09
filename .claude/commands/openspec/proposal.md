---
name: OpenSpec: Proposal
description: Scaffold a new OpenSpec change and validate strictly.
category: OpenSpec
tags: [openspec, change]
---

<!-- OPENSPEC:START -->

**Guardrails**

- You SHOULD favor straightforward, minimal implementations first and add
  complexity only when it is requested or clearly required. This keeps proposals
  focused and prevents over-engineering.
- You MUST keep changes tightly scoped to the requested outcome. Scope creep is
  the enemy of good proposals. If you find related work, ask about it rather
  than adding it.
- You SHOULD refer to `openspec/AGENTS.md` (located inside the `openspec/`
  directory—run `ls openspec` or `pnpm openspec update` if you don't see it) if
  you need additional OpenSpec conventions or clarifications.
- You MUST identify any vague or ambiguous details in the request BEFORE
  starting the proposal. Ask follow-up questions to clarify:
  - What does "done" look like? (success criteria)
  - What are the constraints? (must not break X, must support Y)
  - What's the priority? (scope and timeline)
- You MUST NOT write any code during the proposal stage. Proposals are design
  documents only. Implementation happens in the apply stage after approval. This
  prevents wasting code that might be rejected or require redesign.

**Steps**

1. You MUST review `openspec/project.md`, run `pnpm openspec list` and
   `pnpm openspec list --specs`, and you SHOULD inspect related code or docs
   (e.g., via `rg`/`ls`) to ground the proposal in current behavior. You MUST
   note any gaps that require clarification.

2. You MUST choose a unique verb-led `change-id` (e.g., "add-dark-mode" not
   "dark-mode") and scaffold `proposal.md`, `tasks.md`, and `design.md` (when
   needed) under `openspec/changes/<id>/`. Verb-led IDs make proposal lists
   easier to scan.

3. You MUST map the change into concrete capabilities or requirements and break
   multi-scope efforts into distinct spec deltas with clear relationships and
   sequencing. This prevents one proposal from trying to do everything at once.

4. You MUST capture architectural reasoning in `design.md` when the solution
   spans multiple systems, introduces new patterns, or requires significant
   trade-off discussion before committing to specs.

5. You MUST draft spec deltas in `changes/<id>/specs/<capability>/spec.md` (one
   folder per capability) using `## ADDED|MODIFIED|REMOVED Requirements` with at
   least one `#### Scenario:` per requirement. Scenarios make specs concrete
   instead of abstract.

6. You MUST draft `tasks.md` as an ordered list of small, verifiable work items
   (each completable in 1-2 days). Each task MUST deliver user-visible progress
   and include validation steps (tests, tooling). You SHOULD highlight
   dependencies or parallelizable work.

7. You MUST validate with `pnpm openspec validate <id> --strict` and resolve
   every issue before sharing the proposal. Don't submit proposals with
   validation errors—this prevents ambiguous specs.

**Reference**

- Use `pnpm openspec show <id> --json --deltas-only` or
  `pnpm openspec show <spec> --type spec` to inspect details when validation
  fails.
- Search existing requirements with
  `rg -n "Requirement:|Scenario:" openspec/specs` before writing new ones.
- Explore the codebase with `rg <keyword>`, `ls`, or direct file reads so
proposals align with current implementation realities.
<!-- OPENSPEC:END -->
