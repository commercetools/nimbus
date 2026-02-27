# Engineering Documentation Template Guide

This guide explains how to use the `engineering-docs-template.mdx` to create
consistent, high-quality implementation documentation for Nimbus components.

## Overview

The engineering documentation template provides a structured approach for
documenting components in the Nimbus design system. It was created by analyzing
existing component documentation (DateRangePicker and DateRangePickerField) and
extracting common patterns and best practices.

## Template Structure

### Required Sections

These sections must be included in every component's engineering documentation:

1. **Frontmatter** - Metadata for the documentation system
2. **Getting started** - Import statement and basic usage
3. **Usage examples** - Component features, variants, and states
4. **Component requirements** - Accessibility requirements (mandatory)
5. **API reference** - PropsTable component
6. **Testing your implementation** - Testing patterns and examples
7. **Resources** - Links to Storybook and external documentation

### Optional Sections

Include these sections only when relevant to your component:

1. **Comparison section** - For field pattern components showing manual vs field
   pattern usage
2. **Library-specific sections** - For components that require external
   libraries (e.g., @internationalized/date)
3. **Form integration** - For field pattern components showing Formik
   integration
4. **Common patterns** - Recommended but optional; shows realistic use cases

## Using the Template

### Step 1: Analyze Component Source Code

**CRITICAL: Start by analyzing the component's actual implementation**

Before copying the template, thoroughly review:

1. **Component's TypeScript props interface** (`.types.ts` file)
   - Identify all props and their types
   - Note which features exist (size?, variant?, isDisabled?, isInvalid?, etc.)
   - Understand controlled/uncontrolled patterns (value/defaultValue)

2. **Component implementation** (main `.tsx` file)
   - Identify React Aria integration
   - Note external library dependencies
   - Understand keyboard interactions
   - Identify accessibility patterns

3. **Existing Storybook stories** (`.stories.tsx` file)
   - See what features are already demonstrated
   - Understand common use cases
   - Note edge cases and variations

**Key Principle:** Let the component's actual features dictate the documentation
structure. Don't force patterns that don't apply to your specific component.

### Step 2: Copy and Rename

```bash
cp docs/engineering-docs-template.mdx packages/nimbus/src/components/[component-name]/[component-name].dev.mdx
```

Or for pattern components:

```bash
cp docs/engineering-docs-template.mdx packages/nimbus/src/patterns/[pattern-category]/[pattern-name]/[pattern-name].dev.mdx
```

### Step 3: Update Frontmatter

```yaml
---
title: [ComponentName] [Component/Pattern]  # Use "Pattern" for fields, "Component" for others
tab-title: Implementation
tab-order: 3
---
```

### Step 4: Work Through Each Section

Follow the inline guidance comments in the template to:

- Replace all `[placeholders]` with component-specific content
- **Remove sections that don't apply to your component**
- **Add subsections for features that exist in your component's props**
- Customize examples based on actual component behavior
- Remove all HTML comments before publishing

## Section-by-Section Guide

### Comparison Section (Optional)

**When to include:**

- For field pattern components (e.g., DateRangePickerField, TextInputField)
- When there's a clear alternative approach (manual FormField composition)

**When to exclude:**

- For base components (e.g., DateRangePicker, Button)
- For components that don't have pattern alternatives

**Example:** See DateRangePickerField comparison section

### Getting Started

**Required for all components**

#### Import Section

Always include both the component and its type in the import:

```tsx
import { ComponentName, type ComponentNameProps } from "@commercetools/nimbus";
```

#### Basic Usage Section

Show the simplest possible usage. Use uncontrolled mode for field components, or
the most basic configuration for other components.

```jsx live-dev
const App = () => <ComponentName />;
```

### Library-Specific Sections (Conditional)

**When to include:**

- Components that require external libraries (e.g., @internationalized/date,
  TipTap, ProseMirror)
- When developers need to understand library concepts to use the component

**When to exclude:**

- Components that only use React and Nimbus dependencies
- When the library integration is transparent to users

**Examples:**

- DateRangePicker includes "Working with date values" explaining
  @internationalized/date
- RichTextInput might include "Working with TipTap" explaining editor concepts

**Structure:**

1. Introduce the library and its purpose
2. Show type definitions or core concepts
3. Demonstrate creation and conversion patterns
4. Link to external documentation

### Dynamic Collections (Optional)

**When to include:**

- Components that support dynamic data mapping (e.g., Select, ListBox, Menu)
- Components that implement the React Aria `items` prop pattern

**Structure:**

1. Explain the benefit (performance, virtualization)
2. Show example with static children
3. Show example with dynamic `items` and render prop
4. Provide data structure example

### Usage Examples

**Required for all components**

#### Determining Examples from Source Code

**CRITICAL PRINCIPLE:** Analyze the component's props interface to determine
what examples to include. Don't force standard patterns if they don't exist in
your component.

**Approach:**

1. **Review the component's TypeScript props interface**
   - Look for `size?`, `variant?`, `isDisabled?`, `isInvalid?`, `isReadOnly?`
     props
   - Look for `items` prop (dynamic collections) and slot props
     (`leadingElement`, `trailingElement`)
   - Note any unique props specific to this component
   - Understand controlled/uncontrolled patterns

2. **Match examples to actual props**
   - ✅ Component has `isDisabled` prop → Include "Disabled state" subsection
   - ❌ Component has no `isDisabled` prop → Don't include "Disabled state"
   - ✅ Component has unique `granularity` prop → Document it!
   - ✅ Component has `isInvalid` and `isReadOnly` → Include those states

3. **Order examples by complexity**
   - Start with simple visual variants (size, appearance)
   - Move to component-specific features
   - Show state variations (if applicable)
   - End with controlled/uncontrolled modes

#### Common Patterns by Component Type

**Input-like components** (TextInput, NumberInput, Select):

- May include: Size options, Visual variants, Disabled state, Invalid state,
  Read-only state, Required field, With description, With validation errors
- Always include: Uncontrolled mode, Controlled mode

**Layout components** (Stack, Box, Card):

- Focus on: Composition patterns, Spacing variants, Responsive behavior
- Skip: State variations, controlled/uncontrolled modes

**Interactive components** (Button, Menu, Dialog):

- Focus on: Visual variants, Sizes, Events, Keyboard interactions
- May include: Disabled state, Loading state

**Display components** (Badge, Avatar, Icon):

- Focus on: Visual variants, Sizes, Content variations
- Skip: Controlled modes, state management

#### Example Structure

```jsx live-dev
const App = () => (
  <Stack direction="column" gap="400">
    <ComponentName size="sm" />
    <ComponentName size="md" />
  </Stack>
);
```

#### State Management Patterns

**Type Inference for Controlled State:**

Always use props interface for type inference:

```jsx live-dev
const App = () => {
  // ✅ Correct - infers from component props
  const [value, setValue] = useState < ComponentNameProps["value"] > null;

  // ❌ Incorrect - inline type definition
  // const [value, setValue] = useState<string | null>(null);
};
```

**State Display Pattern:**

Controlled examples should always show the current value:

```jsx live-dev
const App = () => {
  const [value, setValue] = useState < ComponentNameProps["value"] > null;

  return (
    <Stack direction="column" gap="400">
      <ComponentName value={value} onChange={setValue} />
      <Text fontSize="sm">{value ? `Selected: ${value}` : "No selection"}</Text>
    </Stack>
  );
};
```

### Component Requirements

**Required: Accessibility**

Every component must document accessibility requirements:

- How to provide accessible labels (aria-label, aria-labelledby, or htmlFor)
- Keyboard navigation support
- Screen reader considerations
- ARIA attributes used

**Optional subsections:**

- Type/value requirements (e.g., date components requiring specific date types)
- Error handling (for field pattern components)
- Integration requirements (if component needs specific setup)

### API Reference

**Required for all components**

Use the PropsTable component:

```markdown
## API reference

<PropsTable id="ComponentName" />
```

For field pattern components with custom error rendering, add a subsection:

```markdown
### Custom error rendering

[Show renderError prop usage]
```

### Form Integration (Optional)

**When to include:**

- Field pattern components
- Components commonly used in forms

**When to exclude:**

- Base components not typically used in forms
- Components without form-specific behavior

**Show:**

- Formik integration example
- Key integration points (value, onChange, onBlur, errors, touched)
- Complete working example

### Common Patterns (Recommended)

**Include 2-3 realistic use cases:**

- Production-ready scenarios
- Integration with other components
- Proper state management
- Realistic data handling

**Examples:**

- "Filtering data by date range" (DateRangePicker)
- "Promotion period selection" (DateRangePicker)
- "Form validation with Formik" (field components)

### Testing Your Implementation

**Required for all components**

#### Mandatory Opening Disclaimer

Every Testing section **MUST** start with this exact disclaimer (not in a
comment):

```markdown
These examples demonstrate how to test your implementation when using
[ComponentName] in your application. The component's internal functionality is
already tested by Nimbus - these patterns help you verify your integration and
application-specific logic.
```

This appears as regular paragraph text, not as a blockquote or comment.

#### Test Categories

Include these test categories:

1. **Basic rendering tests** - Verify component renders expected elements
2. **Interaction tests** - Test user interactions (clicks, typing, keyboard)
3. **Value/type-specific tests** - If component has special value handling
4. **Feature-specific tests** - For component-specific features

#### Test Code Patterns

**User Interaction Setup:**

Always use `userEvent.setup()`:

```tsx
const user = userEvent.setup();
await user.click(element);
```

**Async Content (Portals/Popovers):**

When testing portal content, query document directly and use waitFor:

```tsx
await waitFor(() => {
  expect(screen.getByRole("dialog")).toBeInTheDocument();
});

// Or for content only findable in document:
await waitFor(() => {
  const content = document.querySelector('[role="listbox"]');
  expect(content).toBeInTheDocument();
});
```

### Resources

**Required for all components**

#### Storybook Links

Use actual URL pattern when possible:

**For base components:**

```markdown
- [Storybook](https://nimbus-storybook.vercel.app/?path=/docs/components-[component]--docs)
```

**For field patterns:**

```markdown
- [Storybook](https://nimbus-storybook.vercel.app/?path=/docs/patterns-fields-[component]--docs)
```

Use `link-tbd` placeholder only if Storybook URL is not yet available.

#### External Documentation

Include when relevant:

- React Aria documentation link (if component uses React Aria)
- ARIA pattern link (if applicable)

#### Internal Links

**For field patterns, always include:**

- Link to base component
- Link to FormField component
- Link to FieldErrors component

**Example for field patterns:**

```markdown
- [Base Component](components/[category]/[component])
- [FormField Component](components/inputs/formfield)
- [FieldErrors Component](components/forms/fielderrors)
```

## Component Type Examples

### Base Component (DateRangePicker)

**Include:**

- Getting started ✓
- Working with date values ✓ (library-specific)
- Usage examples ✓
- Component requirements ✓
- API reference ✓
- Common patterns ✓
- Testing ✓
- Resources ✓

**Exclude:**

- Comparison section ✗
- Form integration ✗

### Field Pattern Component (DateRangePickerField)

**Include:**

- Comparison section ✓
- Getting started ✓
- Usage examples ✓
- Component requirements ✓ (including error handling)
- Form integration ✓
- API reference ✓
- Testing ✓
- Resources ✓

**Exclude:**

- Working with date values ✗ (reference base component instead)
- Common patterns ✗ (shown in form integration)

### Simple Component (Button, Badge)

**Include:**

- Getting started ✓
- Usage examples ✓ (fewer subsections)
- Component requirements ✓
- API reference ✓
- Testing ✓ (simpler tests)
- Resources ✓

**Exclude:**

- Comparison section ✗
- Library-specific sections ✗
- Form integration ✗
- Common patterns ✗ (unless particularly useful)

## Code Example Best Practices

### Interactive Examples

**Always use `jsx live-dev` for interactive examples:**

```jsx live-dev
const App = () => {
  const [value, setValue] = useState(initialValue);

  return <ComponentName value={value} onChange={setValue} />;
};
```

**Guidelines:**

- Start with `const App = () => {`
- Use realistic state management (useState)
- Include TypeScript type annotations
- Keep examples focused and concise
- Use proper Nimbus components (Stack, Text, Button)
- Show realistic use cases

### Non-Interactive Examples

**Use `tsx` for type definitions and test code:**

```tsx
type ComponentProps = {
  value: string;
  onChange: (value: string) => void;
};
```

### State Management

**Demonstrate proper patterns:**

```jsx live-dev
const App = () => {
  // ✓ Good: Proper type annotation
  const [value, setValue] = useState < ComponentProps["value"] > null;

  // ✓ Good: Clear state initialization
  const [touched, setTouched] = useState < boolean > false;

  // ✓ Good: Derived state
  const isValid = value !== null;

  return (
    <ComponentName
      value={value}
      onChange={setValue}
      onBlur={() => setTouched(true)}
    />
  );
};
```

## Writing Style Guidelines

### Voice and Tone

- Use clear, concise language
- Write in active voice
- Use present tense
- Address the reader directly ("you need to", "use this when")

### Code Comments

- Use inline comments sparingly in examples
- Explain "why" not "what"
- Use descriptive variable names instead of excessive comments

### Formatting

- Use **bold** for emphasis on key concepts
- Use `code` formatting for props, values, and code references
- Use blockquotes with `[!TIP]` for helpful tips
- Use tables for keyboard shortcuts and comparisons

### Examples

```markdown
<!-- ✓ Good -->

The `granularity` prop controls both the level of date precision and the
component's behavior.

<!-- ✗ Bad -->

You can use the granularity prop to control precision and behavior.
```

## Validation Checklist

Before publishing, verify:

### Critical Pattern Compliance

- [ ] All interactive examples use `jsx live-dev` (NOT `jsx live`)
- [ ] Getting Started includes type import
      (`import { ComponentName, type ComponentNameProps }`)
- [ ] Controlled examples use `ComponentNameProps["value"]` type pattern
- [ ] Testing section includes mandatory disclaimer paragraph
- [ ] Accessibility section includes standard boilerplate
- [ ] Accessibility includes PERSISTENT_ID tracking pattern
- [ ] Accessibility includes Keyboard navigation subsection

### Source-Driven Content

- [ ] **Usage examples reflect actual component props** (not generic template
      examples)
- [ ] Component props interface was analyzed before writing examples
- [ ] Only documented features that exist in the component
- [ ] No forced patterns (e.g., no "disabled state" if component has no
      `isDisabled` prop)
- [ ] Component-specific features are highlighted

### Content

- [ ] All placeholders replaced with component-specific content
- [ ] All HTML comments removed
- [ ] Examples are realistic and functional
- [ ] TypeScript types are correct
- [ ] Accessibility requirements documented
- [ ] Testing examples provided

### Structure

- [ ] Frontmatter is complete and correct
- [ ] Required sections are present
- [ ] Optional sections are included only when relevant
- [ ] Sections are in the correct order
- [ ] Code blocks use correct language tags

### Code Examples

- [ ] All interactive examples use `jsx live-dev`
- [ ] All type/test examples use `tsx`
- [ ] Examples follow `const App = () => { }` pattern
- [ ] State declarations use prop type inference pattern
- [ ] Controlled examples include state display with Text component
- [ ] Test examples use `userEvent.setup()` pattern
- [ ] Portal/popover tests use `waitFor` and document queries

### Links

- [ ] Storybook link uses actual URL pattern (when available)
- [ ] Field patterns link to FormField and FieldErrors
- [ ] Field patterns link to base component
- [ ] External documentation links are correct
- [ ] All links are accessible

## Getting Help

If you're unsure about any aspect of the template:

1. **Review existing documentation:**
   - `packages/nimbus/src/components/date-range-picker/date-range-picker.dev.mdx`
   - `packages/nimbus/src/patterns/fields/date-range-picker-field/date-range-picker-field.dev.mdx`

2. **Check component guidelines:**
   - `docs/file-type-guidelines/documentation.md`

3. **Ask the team:**
   - Open a discussion in the design system channel
   - Review with documentation reviewers

## Version History

- **v1.0** (2025-01-06): Initial template created from DateRangePicker and
  DateRangePickerField analysis
