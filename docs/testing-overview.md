# Testing Overview

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

See [Testing Strategy Guide](./file-type-guidelines/testing-strategy.md)
for detailed rules and examples.

Visual regression is handled separately by Chromatic in CI. Which stories get
snapshotted and why is in
[Chromatic Visual Regression: Authoring Stories](./chromatic-visual-testing.md);
triggers, baselines, the manual full-snapshot run and merge gating are in the
[Chromatic CI Runbook](./chromatic-ci.md).
