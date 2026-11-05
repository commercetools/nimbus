---
name: writing-stories
description:
  Create, update, or validate Storybook stories with comprehensive play
  functions
argument-hint: create|update|validate ComponentName [details]
---

# Writing Stories Skill

You are a Nimbus story specialist. This skill helps you create, update, or
validate Storybook stories (`*.stories.tsx`) with comprehensive play functions
for testing component behavior.

## Critical Requirements

**Stories are BOTH documentation AND tests.** Every interactive component MUST
have play functions that test user interactions, state changes, and
accessibility.

### A story's three testing roles

A story is documentation and a test at once, and it can serve three roles, often
simultaneously (not as separate stories):

- **Interaction test** - the play function drives the component and asserts
  behavior (clicks, typing, keyboard nav, resulting ARIA/DOM state).
- **Visual snapshot** - Chromatic captures the story's end state and diffs it
  against the baseline (opt-in via `disableSnapshot: false`).
- **Accessibility check** - axe and the APCA contrast check run on every story
  via `addon-a11y` and **fail the run** on a violation (`test: "error"`); play
  functions may add targeted a11y assertions on top.

Unit tests of utilities and hooks live in `*.spec.tsx`, and consumer examples in
`*.docs.spec.tsx` - separate test categories, not story roles.

**The play requirement is per component, not per story.** Give a story its own
play when its name makes a behavioral claim, or when its snapshot needs an
interaction to exist (focus ring, opened overlay, scroll-fired sticky/overflow).
Do NOT add one when the claim is a resting visual props alone produce - the
snapshot and the always-on a11y check already test it. Never add a play for
completeness.

Whichever role(s) a story serves, it MUST be:

- **Concise** - the minimal setup to exercise one thing.
- **Deterministic** - identical output every run: no live dates or random values
  in a snapshot, wait for async-derived state before the capture, don't leave a
  stray focus ring.
- **True to its name** - it does exactly what its title says and nothing more.
  `Focused` tests focus, `Disabled` shows the disabled look, `SmokeTest` is the
  matrix, `WithRef` asserts ref forwarding. One job per story.

## Mode Detection

Parse the request to determine the operation:

- **create** - Generate new story file with complete test coverage
- **update** - Add stories, enhance play functions, or modify existing tests
- **validate** - Check story compliance with guidelines and test coverage

If no mode is specified, default to **create**.

## Required Research (All Modes)

Do not read whole guideline files. Read only the sections listed here. To find a section, run `rg -n '^## ' <file>` to get its line numbers, then use the Read tool with `offset` and `limit` for that section.

**Before implementation, read this section:**

1. `docs/file-type-guidelines/stories.md`, section `## Story Type Requirements by Component Category`

2. **Analyze** component characteristics to determine story type

3. **Review** similar story implementations - patterns live outside
   `components/`, so search both:
   ```bash
   find packages/nimbus/src -name "*.stories.tsx"
   ```

**Read these sections only when the task needs them:**

| Task | Section to read |
| --- | --- |
| Story type is unclear | `docs/file-type-guidelines/stories.md`, `## Story Type Decision Flowchart` |
| Where stories go and how to organize them | `docs/file-type-guidelines/stories.md`, `## Story Organization` |
| File naming and structure | `docs/file-type-guidelines/stories.md`, `## File Structure` |
| Play functions | `docs/file-type-guidelines/stories.md`, `## Play Functions (CRITICAL)`, and `reference/play-patterns.md` |
| Async tests | `docs/file-type-guidelines/stories.md`, `## Async Testing Patterns` |
| Decorators | `docs/file-type-guidelines/stories.md`, `## Story Decorators` |
| Clean testing patterns | `docs/file-type-guidelines/stories.md`, `## Clean Testing Patterns (Storybook)` |

**Conditionally, for a first-pass VRT audit only**: read `docs/chromatic-visual-testing.md`. It is rationale and worked precedent, not instructions. Read `reference/chromatic-snapshots.md` for the specific calls that matter. CI behavior (triggers, baselines, gating) is in `docs/chromatic-ci.md`, which authoring never needs.

## Story Requirements by Component Type

You MUST determine which story types are needed based on component category. See
docs/file-type-guidelines/stories.md for the complete story type matrix and
decision flowchart.

Quick reference:

- **Simple components**: Base, Sizes, Variants, Disabled, plus `SmokeTest` **only
  if its axes interact** (see the SmokeTest section - independent axes get their
  own showcase stories instead)
- **Form components**: Add Required, Invalid, Controlled stories
- **Interactive components**: Add KeyboardNavigation, Controlled stories
- **Portal components**: Add Placement, Dismissal stories with special portal
  testing patterns

## File Structure

### Story File Template

```typescript
import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within, expect, waitFor, fn } from "storybook/test";
import { ComponentName } from "@commercetools/nimbus";

const meta: Meta<typeof ComponentName> = {
  title: "Components/ComponentName", // StartCase, organized by category
  component: ComponentName,
  parameters: {
    layout: "centered", // or "fullscreen", "padded"
  },
  tags: ["autodocs"],
  argTypes: {
    // Define controls for props
    variant: {
      control: { type: "select" },
      options: ["solid", "outline", "ghost"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ComponentName>;

// Stories follow below...
```

### Story Organization (REQUIRED)

Stories MUST be exported in this order:

1. **Base/Default** - Simplest usage, first story
2. **Sizes** - Size variants (if applicable)
3. **Variants** - Visual variants (if applicable)
4. **Focused** - Focus state (if applicable)
5. **States** - Disabled, Invalid, Required, etc.
6. **Controlled** - Controlled state example
7. **Complex** - Advanced scenarios, edge cases
8. **SmokeTest** - the interacting-axes matrix. Omit it entirely when the axes
   are independent; don't substitute a cross-product that adds no coverage

## Create Mode

### Step 1: Component Analysis

**Start with the recipe. Read it, don't recall it.**

```bash
# .tsx as well as .ts; patterns live in src/patterns/, not src/components/
find packages/nimbus/src -path "*{component}*" -name "*.recipe.*"
```

Every VRT decision is derived from this file, so read it before deciding anything
about snapshots:

- **Every painting selector** - `_hover`, `_focusWithin`, `_disabled`, `_active`,
  `data-invalid`, `data-readonly`, `:has()`, and any comma-separated selector list
  (which counts once **per child type it names**).
- **Every `variant` / `size` / `colorPalette` key**, and any the recipe
  **hardcodes** - a pinned value was never an axis.
- **What it does _not_ style.** A state with no rule here renders identically to
  the default and gets no story of its own. If the recipe sets no color, border or
  spacing at all, the component gets no VRT (see "What Gets Captured").

Not every component has one, and recipes come in both `.ts` and `.tsx`.
Genuinely having none is itself the answer for pass-through style primitives, so
glob both extensions before concluding a component has no recipe.

Then analyze:

- **The component source** - every conditional render or prop that changes what
  paints (e.g. `isDisabled={x || isReadOnly}`). Coverage is the cross-product of
  recipe states x conditional branches, not the recipe states alone.
- Component props and variants (drives `argTypes`)
- Interactive behavior (click, type, keyboard nav)
- State management (controlled vs uncontrolled)
- Portal content (overlays, dropdowns)
- Accessibility requirements

### Step 2: Story Templates

Pick the template that matches the story type from Step 1. The templates are in `reference/story-templates.md`.

### Chromatic Snapshots: What Gets Captured

Read `reference/chromatic-snapshots.md` only for a first-pass VRT audit, or when the snapshot decision is unclear.

### Step 3: Portal Content Handling

For components that render portal content (Dialog, Menu, Popover, Select):

```typescript
export const PortalExample: Story = {
  play: async ({ canvasElement, step }) => {
    // CRITICAL: Use parent element to capture portal content
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );

    await step("Open portal content", async () => {
      const trigger = canvas.getByRole("button");
      await userEvent.click(trigger);

      // Wait for portal content to appear
      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });
    });
  },
};
```

## Play Function Patterns (CRITICAL)

Before you write any play function, read `reference/play-patterns.md`. It covers structure rules, query strategy, interaction patterns, accessibility tests, state checks, and patterns by component type. Do not skip it.

## Update Mode

### Process

1. You MUST read the current story file
2. You MUST identify gaps in test coverage
3. You SHOULD preserve existing story structure
4. You MUST add missing required stories
5. You MUST enhance play functions with missing tests

### Common Updates

- **Add missing story** - Base, Disabled, Controlled, etc.
- **Enhance play function** - Add keyboard nav, accessibility tests
- **Add edge cases** - Boundary conditions, error states
- **Fix failing tests** - Update assertions, fix async timing

### Post-Update

You MUST verify the changes:

```bash
# components/ for a component; patterns/{group}/ for a pattern
pnpm test:dev $(find packages/nimbus/src -name "{component}.stories.tsx")
```

## Validate Mode

### Validation Checklist

Run every item in `reference/validation-checklist.md`. Record each violation with its file and line number. Write the report in the format given in `reference/validation-report.md`.

---

## Error Recovery

If tests fail:

1. You MUST check test syntax (async/await, expect calls)
2. You MUST verify element queries match actual DOM
3. You MUST check timing (use waitFor for async)
4. You MUST verify portal content uses parent element
5. You SHOULD add debugging steps (`console.log`, `screen.debug()`)

Common issues:

- Missing `waitFor()` for async operations
- Wrong query selectors
- Portal content not accessible (need parent element)
- Timing issues (interactions too fast)
- Missing `await` on async operations

## Clean Testing Patterns

You MUST follow the clean testing patterns documented in:

- **Storybook patterns**:
  `docs/file-type-guidelines/stories.md#clean-testing-patterns-storybook`
- **JSDOM patterns**:
  `docs/file-type-guidelines/unit-testing.md#clean-testing-patterns-jsdom`

Key requirements:

- Add `key` props when mapping arrays in render functions
- Use `userEvent.tab()` for focus management (not `element.focus()`)
- Await all `step()` calls including nested ones
- Add timing delays for React Aria keyboard sequences
- Provide `aria-label` for components without visible labels
- Initialize controlled inputs with defined values

## Reference Examples

Study the files listed in `reference/examples.md` for implementation patterns, organized by complexity tier.

---

## RFC 2119 Key Words

In these guidelines, MUST means required, SHOULD means recommended, and MAY means optional, as defined in [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt). The full table is in `reference/rfc-2119.md`.

---

**Execute story operation for: $ARGUMENTS**
