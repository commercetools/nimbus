## Quick Start

- **New component?** Use `/propose-component ComponentName`.
- **Bug fix, typo, docs, or test for existing behavior?** Implement directly. No proposal needed.
- **Any other change?** Use `/opsx:propose`. An OpenSpec proposal is the default for any change that is not a fix.

The full workflow, the agents, and the skills are in `docs/agent-workflow.md`.

## Architecture

Packages, key architecture, and component guidance: `docs/architecture-overview.md`.

## Keep Docs and Tooling in Sync

When you change a pattern (file structure, naming, code style, template format), update every skill, command, guideline, and template that documents it. A pattern change is not complete until the old pattern is gone from all of them. Details: `docs/maintaining-docs.md`.

## Package Execution

Always use `pnpx` or `pnpm exec` instead of `npx` to execute packages:

```bash
pnpx tsx script.ts
pnpm exec prettier --write .
```

## Development Commands

The most-used commands are below. Every command, with explanations, is in `docs/dev-commands.md`.

```bash
pnpm install                                        # install dependencies
pnpm start                                          # docs site and Storybook
pnpm test:dev <files>                               # tests against source (use for TDD)
pnpm --filter @commercetools/nimbus typecheck:dev   # typecheck against source (matches your editor)
pnpm typecheck:strict                               # CI gate: typecheck against the built dist (needs a prior build)
pnpm lint                                           # lint all files
```

## Code Architecture

### Package Structure

- **packages/nimbus**: Core UI component library with React Aria Components
- **packages/tokens**: Design tokens (colors, spacing, typography, animations)
- **packages/nimbus-icons**: SVG icons wrapped as React components (Material
  Icons + custom)
- **packages/color-tokens**: Brand-specific color definitions
- **packages/i18n**: Translation messages and internationalization support
- **apps/docs**: Documentation SPA with interactive examples and auto-generated
  content

### Chakra UI Imports (CRITICAL)

**NEVER use barrel imports from `@chakra-ui/react`.** Always use modular subpath
imports to avoid pulling in the entire component library:

```typescript
// ✅ Correct - modular imports
import { defineRecipe, HTMLChakraProps } from "@chakra-ui/react/styled-system";
import { Box } from "@chakra-ui/react/box";
import { Steps } from "@chakra-ui/react/steps";
import { useBreakpointValue } from "@chakra-ui/react/hooks";
import { mergeRefs } from "@/utils"; // local utility, not from Chakra

// ❌ WRONG - barrel import loads every component
import { defineRecipe, Box, mergeRefs } from "@chakra-ui/react";
```

### Component Development

For comprehensive component development guidance, see:

- Component Guidelines: `./docs/component-guidelines.md`
- Architecture Decisions:
  `./docs/file-type-guidelines/architecture-decisions.md`
- File Review Protocol: `./docs/file-review-protocol.md`

## MCP Server Tools

This project includes integrated MCP (Model Context Protocol) tooling that
provides automated development workflows. Leverage these tools for automated
tasks:

### Available MCP Servers

- **context7**: Primary interface for querying library documentation for React
  Aria, Chakra UI, and other libraries before implementing features.
- **playwright**: Browser automation for visual testing and web interaction to
  verify UI changes and test user flows.
- **sequential-thinking**: For complex planning and multi-step reasoning when
  tackling large features or architecture design decisions that require
  systematic analysis.

### Usage Guidelines

- **Always** use context7 to find relevant documentation before implementing new
  components or patterns
- **Proactively** use playwright to visually verify UI changes and capture
  screenshots for documentation
- **Leverage** sequential-thinking for breaking down complex tasks into
  manageable steps
- These tools are pre-configured and ready to use - no additional setup required

### Agent-Driven Development Workflow

**Use specialized agents proactively in an iterative cycle for all component
development:**

1. **Research Phase** (nimbus-researcher): Gather requirements, patterns,
   library documentation, and architectural guidance before writing any code
2. **Implementation Phase** (nimbus-coder): Write code strictly according to the
   guidelines and patterns identified in research
3. **Review Phase** (nimbus-reviewer): Validate code compliance against Nimbus
   standards and guidelines
4. **Iteration**: If review identifies non-compliance or improvement areas,
   return to implementation phase and repeat until all standards are met

Invoke agents autonomously when task complexity warrants it - don't wait for
explicit user requests. The goal is to leverage automation intelligently by
recognizing when a task's scope or requirements align with an agent's
capabilities.

## Development Workflow Best Practices

### Testing Strategy

The testing system uses Vitest with three distinct test categories:

| Category                          | File Pattern      | Purpose                                  | Audience     |
| --------------------------------- | ----------------- | ---------------------------------------- | ------------ |
| **Story Tests**                   | `*.stories.tsx`   | Internal component behavior testing      | Internal     |
| **Internal Unit Tests**           | `*.spec.tsx`      | Internal utility and hook testing        | Internal     |
| **Consumer Implementation Tests** | `*.docs.spec.tsx` | Documentation examples for consumer apps | **External** |

- **Story Tests**: Test component behavior with play functions in headless
  Chromium via Playwright. ALL component states, interactions, and a11y tested
  here.
- **Internal Unit Tests**: Fast JSDOM-based tests for utilities and hooks.
- **Consumer Implementation Tests**: Working code examples consumers can copy to
  test components in their apps. Injected into `.dev.mdx` docs at build time.

See [Testing Strategy Guide](./docs/file-type-guidelines/testing-strategy.md)
for detailed rules and examples.

Visual regression is handled separately by Chromatic in CI. Which stories get
snapshotted and why is in
[Chromatic Visual Regression: Authoring Stories](./docs/chromatic-visual-testing.md);
triggers, baselines, the manual full-snapshot run and merge gating are in the
[Chromatic CI Runbook](./docs/chromatic-ci.md).

### Git Conventions

See [Git Conventions](./docs/git-conventions.md) for branch naming, commit
message format, and test commands.

### Build Dependencies

Understanding build order is crucial:

1. **Design tokens** (`packages/tokens`) - Must build first
2. **Packages** (`packages/*`) - Depend on tokens
3. **Documentation** (`apps/docs`) - Depends on packages
4. **i18n compilation** - Translation data for runtime
