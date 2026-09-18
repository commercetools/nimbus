# Testing Strategy Guide

[← Back to Index](./index.md) |
[← Component Guidelines](../component-guidelines.md)

> **Note**: This guide is the authoritative source for test **categorization** —
> which category a test belongs to, and why. It is not authoritative for file
> extensions: `docs/naming-conventions.md` owns those. Where this guide shows a
> filename, it is illustrating a category.

## Overview

Nimbus uses 3 test categories, each serving a distinct purpose and audience.

## The 3 Test Categories

| Category                          | File Pattern               | Purpose                                  | Audience     |
| --------------------------------- | -------------------------- | ---------------------------------------- | ------------ |
| **Story Tests**                   | `*.stories.tsx`            | Internal component behavior testing      | Internal     |
| **Internal Unit Tests**           | `*.spec.ts` / `*.spec.tsx` | Internal utility and hook testing        | Internal     |
| **Consumer Implementation Tests** | `*.docs.spec.tsx`          | Documentation examples for consumer apps | **External** |

Internal unit tests take `.spec.tsx` only when the file contains JSX, and
`.spec.ts` when it does not — see
[Naming Conventions](../naming-conventions.md#rule-2-extension-follows-contents).
Consumer implementation tests are always `.docs.spec.tsx`.

> **Note on the test runner**: `vitest.unit.config.ts` includes
> `src/**/*.spec.{ts,tsx}` with no `*.docs.spec.*` exclusion, so consumer
> implementation tests currently execute in the same `unit` project as internal
> unit tests. The categories below describe purpose and audience, not separate
> runner projects.

---

## Story Tests (`*.stories.tsx`)

### Purpose

Storybook stories test **internal component behavior**. They verify that our
components work correctly from a maintainer perspective.

### What Belongs Here

- Component rendering and visual states
- Interactive behavior (click, type, keyboard navigation)
- ARIA attributes and accessibility compliance
- State management (disabled, invalid, required, loading)
- Visual variants and sizes
- Focus management

### Example

```typescript
export const Disabled: Story = {
  args: { isDisabled: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");

    await expect(button).toHaveAttribute("aria-disabled", "true");
    await userEvent.tab();
    await expect(button).not.toHaveFocus();
  },
};
```

---

## Internal Unit Tests (`*.spec.ts` / `*.spec.tsx`)

### Purpose

Unit tests provide **fast, isolated testing** of utility functions and React
hooks. They run in JSDOM and test non-component logic.

### What Belongs Here

- Utility functions and helpers
- Custom React hooks (using `renderHook`)
- Pure functions and transformations
- Validation functions
- Data formatting utilities

### Example

```typescript
describe("formatCurrency", () => {
  it("formats USD with proper decimals", () => {
    expect(formatCurrency(1234.5, "USD")).toBe("$1,234.50");
  });
});
```

---

## Consumer Implementation Tests (`*.docs.spec.tsx`)

### Purpose

Consumer Implementation Tests are **working code examples** that consumers can
copy to test Nimbus components in their applications. These tests are
automatically injected into engineering documentation at build time.

**Key point**: These are documentation examples, not internal QA tests.

### What Belongs Here

Examples showing consumers how to:

- Integrate with form libraries (Formik, React Hook Form)
- Load async data into components
- Manage state with external libraries (Redux, Zustand)
- Handle errors in application context
- Build multi-component workflows

### Example

```typescript
/**
 * @docs-section form-integration
 * @docs-title Form Integration with Formik
 * @docs-description Example showing form submission with Formik
 * @docs-order 1
 */
describe("TextInput - Formik Integration", () => {
  it("submits form with valid data", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <Formik initialValues={{ email: "" }} onSubmit={onSubmit}>
          {({ handleSubmit, values, handleChange }) => (
            <form onSubmit={handleSubmit}>
              <TextInput
                name="email"
                value={values.email}
                onChange={handleChange}
              />
              <Button type="submit">Submit</Button>
            </form>
          )}
        </Formik>
      </NimbusProvider>
    );

    await user.type(screen.getByRole("textbox"), "test@example.com");
    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(onSubmit).toHaveBeenCalledWith(
      { email: "test@example.com" },
      expect.anything()
    );
  });
});
```

### What Does NOT Belong Here

Internal component behavior tests belong in Stories, not here:

- Testing `isDisabled`/`isInvalid`/`isRequired` states
- Testing ARIA attributes
- Testing keyboard navigation
- Testing basic render structure
- Testing visual variants

---

## Decision Flowchart

```mermaid
flowchart TD
    Start[What am I testing?] --> Q1{Utility function,<br/>hook, or pure logic?}

    Q1 -->|Yes| Unit[Internal Unit Test<br/>.spec.ts or .spec.tsx]
    Q1 -->|No| Q2{Documentation example<br/>for consumers?}

    Q2 -->|Yes| Consumer[Consumer Implementation Test<br/>.docs.spec.tsx]
    Q2 -->|No| Story[Story Test<br/>.stories.tsx]

    Consumer --> C1[Form integration<br/>Async data loading<br/>State management<br/>Multi-component workflows]

    Story --> S1[ARIA attributes<br/>Keyboard navigation<br/>Visual states<br/>Component behavior]

    Unit --> U1[Utilities<br/>Hooks<br/>Pure functions]
```

---

## Quick Reference

| What You're Testing              | Category                     | File Pattern      |
| -------------------------------- | ---------------------------- | ----------------- |
| Component states and behavior    | Story Test                   | `*.stories.tsx`   |
| ARIA attributes                  | Story Test                   | `*.stories.tsx`   |
| Keyboard navigation              | Story Test                   | `*.stories.tsx`   |
| Visual variants                  | Story Test                   | `*.stories.tsx`   |
| Form library integration example | Consumer Implementation Test | `*.docs.spec.tsx` |
| Async data loading example       | Consumer Implementation Test | `*.docs.spec.tsx` |
| State management example         | Consumer Implementation Test | `*.docs.spec.tsx` |
| Utility function                 | Internal Unit Test           | `*.spec.ts`†      |
| Custom hook                      | Internal Unit Test           | `*.spec.ts`†      |

† `.spec.tsx` instead if the test file contains JSX — for example a hook tested
through a wrapper component. A utility or hook test with no JSX stays
`.spec.ts`.

---

## Related Guidelines

- [Unit Testing](./unit-testing.md) - JSDOM-based testing for utilities and
  hooks
- [Stories](./stories.md) - Storybook stories with play functions
- [Engineering Docs Validation](../engineering-docs-validation.md) - Test file
  integration with documentation

---

[← Back to Index](./index.md) |
[← Component Guidelines](../component-guidelines.md)
