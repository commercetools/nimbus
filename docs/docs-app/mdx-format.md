# MDX Documentation Format

Guidelines for writing component documentation in MDX format for the Nimbus documentation site.

## Overview

MDX files combine Markdown with JSX, allowing you to write documentation with embedded interactive examples. Component documentation files are colocated with their components in `packages/nimbus/src/components/`.

## File Location

```
packages/nimbus/src/components/
└── button/
    ├── button.tsx
    ├── button.mdx        # Overview page (required)
    ├── button.guide.mdx  # Guidance for designers/UX (optional)
    ├── button.dev.mdx    # Developer documentation (optional)
    └── button.a11y.mdx   # Accessibility documentation (optional)
```

**Note:** The documentation structure is flexible and adapts to the type of item being documented (components, hooks, utils, etc.). The structure above shows an established pattern for React components, but other patterns may be used as appropriate.

## Required Frontmatter

Every MDX file must include YAML frontmatter with these required fields:

```yaml
---
id: Components-Button              # Unique identifier (Components-{ComponentName})
title: Button                      # Display name
description: Brief component description  # One-line summary
order: 999                        # Menu display order (use 999 as default)
menu:                             # Menu hierarchy array
  - Components
  - Category Name                 # Data Display, Navigation, Inputs, Feedback, etc.
  - Component Name
tags:                             # Search tags array (always include 'component')
  - component
  - relevant-keywords
---
```

### Optional Frontmatter Fields

```yaml
---
# Lifecycle indicators (when applicable)
lifecycleState: Experimental|Alpha|Beta|Stable|Deprecated|EOL
documentState: InitialDraft|ReviewedInternal|Published

# Design resources (when available)
figmaLink: >-
  https://www.figma.com/design/...
---
```

## Standard Content Structure

Follow this structure for consistent documentation:

```markdown
# Component Name

Brief introduction paragraph explaining what the component is and when to use it.

## Overview

Detailed explanation of the component's purpose, behavior, and primary use cases.

### Resources

Deep dive on details and access design library.

[Figma library](figmaLink)
[React ARIA Docs](reactAriaLink)  # If applicable
[ARIA Pattern](ariaPatternLink)   # If applicable

## Variables

Get familiar with the features.

### Basic Usage

\`\`\`jsx-live
const App = () => (
  <ComponentName>
    Basic example
  </ComponentName>
)
\`\`\`

### Size Variants (If applicable)

\`\`\`jsx-live
const App = () => (
  <Stack direction="row" gap="400" alignItems="center">
    <ComponentName size="sm">Small</ComponentName>
    <ComponentName size="md">Medium</ComponentName>
    <ComponentName size="lg">Large</ComponentName>
  </Stack>
)
\`\`\`

## Guidelines (Optional but recommended)

Use this component strategically to enhance user workflow.

### Best practices

- **Practice 1**: Description
- **Practice 2**: Description

### When to use

> [!TIP]\
> When to use
>
> - **Use case 1:** Description
> - **Use case 2:** Description

> [!CAUTION]\
> When not to use
>
> - **Avoid case 1:** Description
> - **Avoid case 2:** Description

## Specs

<PropsTable id="ComponentName" />

## Accessibility

This component follows WCAG 2.1 AA guidelines.

### Keyboard Navigation

| Key      | Action       |
| -------- | ------------ |
| `Tab`    | Move focus   |
| `Enter`  | Activate     |
| `Escape` | Close/Cancel |

### Screen Reader Support

- Announces role and state
- Provides clear labels
- Updates on state changes
```

## jsx-live Code Blocks

### Basic Pattern

All interactive examples MUST use jsx-live blocks:

````markdown
```jsx-live
const App = () => (
  <Button variant="solid">Click me</Button>
)
```
````

### Key Features

- **No imports needed**: All Nimbus components available globally
- **Must define App component**: Each block needs `const App = () => (`
- **Live rendering**: Code executes in browser, renders as interactive component
- **State support**: Use React hooks (useState, useEffect, etc.)

### With State

````markdown
```jsx-live
const App = () => {
  const [count, setCount] = useState(0);

  return (
    <Stack direction="column" gap="400">
      <Text>Count: {count}</Text>
      <Button onClick={() => setCount(count + 1)}>
        Increment
      </Button>
    </Stack>
  );
}
```
````

### Compound Components

````markdown
```jsx-live
const App = () => (
  <Menu.Root>
    <Menu.Trigger>
      Actions <Icons.KeyboardArrowDown />
    </Menu.Trigger>
    <Menu.Content>
      <Menu.Item id="copy">Copy</Menu.Item>
      <Menu.Item id="paste">Paste</Menu.Item>
    </Menu.Content>
  </Menu.Root>
)
```
````

### Available Components

All Nimbus components are globally available:

- Layout components: `Stack`, `Box`, `Container`
- Form components: `TextInput`, `Button`, `Select`
- Navigation: `Menu`, `Tabs`, `Breadcrumbs`
- Feedback: `Alert`, `Dialog`, `Toast`
- Icons: Access via `Icons` namespace (e.g., `<Icons.Add />`)

## PropsTable Component

Display TypeScript prop definitions:

```markdown
## API

<PropsTable id="ComponentName" />
```

**Important:**
- The `id` parameter must match the component's exported name exactly (case-sensitive)
- For compound components, use the base namespace name (e.g., `"Menu"` not `"Menu.Root"`)
- Component must have exported TypeScript interface in types file

## GitHub-Style Alerts

Use for callouts and warnings:

```markdown
> [!TIP]\
> When to use
>
> - **Use for concise information**
> - **Indicate status clearly**

> [!CAUTION]\
> When not to use
>
> - **Don't overuse**
> - **Don't use as headers**

> [!NOTE]\
> Additional information

> [!WARNING]\
> Important warning
```

Note the `\` at the end of the heading line for proper formatting.

## Code Formatting Standards

- **Proper indentation**: Use 2-space indentation
- **Readable structure**: Format JSX for clarity
- **Realistic examples**: Show actual usage patterns
- **Demonstrate props**: Include relevant props in examples

## Common Patterns

### Demonstrating All Variants

Show all variants in a single example for easy comparison:

````markdown
```jsx-live
const App = () => {
  const variants = ["solid", "subtle", "outline", "ghost"];

  return (
    <Stack direction="row" gap="400" alignItems="center">
      {variants.map((variant) => (
        <Button key={variant} variant={variant}>
          {variant}
        </Button>
      ))}
    </Stack>
  );
}
```
````

### Interactive State Examples

````markdown
```jsx-live
const App = () => {
  const [value, setValue] = useState("");

  return (
    <Stack direction="column" gap="400">
      <TextInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type something..."
      />
      <Text>You typed: {value}</Text>
    </Stack>
  );
}
```
````

## Best Practices

### DO

- ✅ Use jsx-live for all interactive examples
- ✅ Include all required frontmatter fields
- ✅ Follow standard content structure
- ✅ Demonstrate all variants in single code blocks
- ✅ Use realistic, production-ready examples
- ✅ Include accessibility information
- ✅ Add PropsTable for API reference

### DON'T

- ❌ Use multiple code blocks for size/variant variations
- ❌ Use regular markdown code blocks for interactive examples
- ❌ Include Storybook imports or patterns
- ❌ Skip required frontmatter fields
- ❌ Use incomplete or toy examples
- ❌ Omit accessibility documentation

## Validation Checklist

Before committing MDX documentation:

- [ ] Required frontmatter fields present (id, title, description, order, menu, tags)
- [ ] Unique `id` following `Components-{ComponentName}` pattern
- [ ] Proper `menu` hierarchy with category
- [ ] Interactive examples use jsx-live blocks only
- [ ] All code examples properly formatted with 2-space indentation
- [ ] PropsTable component included with correct id
- [ ] Accessibility section with keyboard navigation and screen reader info
- [ ] Resources section with relevant external links
- [ ] No Storybook-specific imports or patterns

## Related Documentation

- [Component Documentation Guidelines](../nimbus/file-type-guidelines/documentation.md) - Detailed MDX requirements
- [Build System](./build-system.md) - How MDX files are processed
- [jsx-live Blocks](./jsx-live-blocks.md) - Interactive code examples
