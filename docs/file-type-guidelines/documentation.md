# Component Documentation (MDX) Guidelines

[← Back to Index](../component-guidelines.md) |
[Previous: Stories](./stories.md) | [Next: Recipes →](./recipes.md)

## Purpose

MDX documentation files (`{component-name}.mdx`) provide comprehensive
documentation for components in the Nimbus documentation site. They combine
markdown content with live code examples.

## When to Use

**Always required** - Every component must have MDX documentation that:

- Explains the component's purpose
- Shows usage examples with live code
- Documents props and API
- Provides accessibility information
- Links to design resources

## File Structure

### Required Frontmatter

Based on analysis of existing component MDX files, all files must include these frontmatter fields:

```yaml
---
id: Components-ComponentName # Required: Unique identifier (Components-{ComponentName})
title: Component Name # Required: Display name
description: Brief description of the component # Required: One-line component description
order: 999 # Required: Menu display order (use 999 as default)
menu: # Required: Menu hierarchy array
  - Components
  - Category Name # Data Display, Navigation, Inputs, Feedback, etc.
  - Component Name
tags: # Required: Search tags array (always include 'component')
  - component
  - relevant-keywords
---
```

### Optional Frontmatter Fields

These fields appear in some components but are not required:

```yaml
---
# Lifecycle indicators (when applicable)
lifecycleState: Experimental|Alpha|Beta|Stable|Deprecated|EOL
documentState: InitialDraft|ReviewedInternal|Published

# Design resources (when available)
figmaLink: >-
  https://www.figma.com/design/...

# Legacy fields (avoid in new components)
documentAudiences: []
---
```

### Standard Content Structure

Based on analysis of existing component MDX files, follow this structure:

```markdown
# Component Name

Brief introduction paragraph explaining what the component is and when to use it.

## Overview

Detailed explanation of the component's purpose, behavior, and primary use cases.

### Key Features (Optional)

- **Feature 1**: Description
- **Feature 2**: Description
- **Feature 3**: Description

### Resources

Deep dive on details and access design library.

[Figma library](figmaLink)
[React ARIA Docs](reactAriaLink) # If applicable
[ARIA Pattern](ariaPatternLink) # If applicable

## Variables (or Examples)

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

#### Medium
This is the default size.

\`\`\`jsx-live
const App = () => <ComponentName size="md">Medium</ComponentName>
\`\`\`

#### Small
For condensed areas.

\`\`\`jsx-live
const App = () => <ComponentName size="sm">Small</ComponentName>
\`\`\`

## Guidelines (Optional but recommended)

Use this component strategically to enhance user workflow.

### Best practices

- **Keyboard Navigation:** Ensure full keyboard accessibility
- **Error Handling:** Provide clear error messages
- **Visual Hierarchy:** Maintain proper visual relationships

### When to use (Optional)

> [!TIP]\
> When to use
- **Use case 1:** Description
- **Use case 2:** Description

> [!CAUTION]\
> When not to use
- **Avoid case 1:** Description
- **Avoid case 2:** Description

## Specs (or API Reference)

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

### WCAG Compliance (For complex components)

#### 1. Perceivable
- **1.3.1 Info and Relationships**: Proper semantic structure
- **1.4.3 Contrast**: Text meets contrast requirements

#### 2. Operable
- **2.1.1 Keyboard**: Full keyboard navigation
- **2.4.7 Focus Visible**: Clear focus indicators

#### 3. Understandable
- **3.2.1 On Focus**: No unexpected context changes
- **3.3.2 Labels**: Clear labeling and instructions

#### 4. Robust
- **4.1.2 Name, Role, Value**: Proper semantic markup
```

## Code Examples

### jsx-live Block Requirements

**CRITICAL**: All interactive examples must use `jsx-live` blocks:

```markdown
✅ CORRECT - jsx-live block
\`\`\`jsx-live
const App = () => (
  <Button variant="solid">Click me</Button>
)
\`\`\`

❌ INCORRECT - No Storybook imports allowed
```

### Code Example Patterns

#### Simple Component Example
```markdown
\`\`\`jsx-live
const App = () => (
  <Badge colorPalette="primary" size="md">
    <Icons.SentimentSatisfied />
    Badge
    <Icons.SentimentSatisfied />
  </Badge>
)
\`\`\`
```

#### Interactive State Example
```markdown
\`\`\`jsx-live
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
\`\`\`
```

#### Compound Component Example
```markdown
\`\`\`jsx-live
const App = () => (
  <Menu.Root>
    <Menu.Trigger>
      Actions
      <Icons.KeyboardArrowDown />
    </Menu.Trigger>
    <Menu.Content>
      <Menu.Item id="copy">Copy</Menu.Item>
      <Menu.Item id="paste">Paste</Menu.Item>
      <Menu.Item id="delete">Delete</Menu.Item>
    </Menu.Content>
  </Menu.Root>
)
\`\`\`
```

### Code Formatting Standards

- **Proper indentation**: Use 2-space indentation consistently
- **Readable structure**: Format JSX for clarity
- **Realistic examples**: Show actual usage patterns
- **Props demonstration**: Include relevant props for each example
- **State management**: Use React hooks when interaction is needed

## Guidelines Section Patterns

### Standard Markdown Lists

```markdown
## Guidelines

Text input guidelines focus on creating clear, accessible, and user-friendly fields.

### Best practices

- **Keyboard Navigation:** Ensure full keyboard accessibility
- **Error Handling:** Provide clear error messages close to the input
- **Placeholder text:** Avoid relying solely on placeholder text
```

### GitHub-style Alerts (When Available)

Some components use GitHub-style alert blocks:

```markdown
> [!TIP]\
> When to use
>
> - **Use for concise information:** Keep badge text short for readability
> - **Indicate status:** Signal state or classification clearly

> [!CAUTION]\
> When not to use
>
> - **Don't overuse badges:** Reserve for important highlights
> - **Don't use as headers:** Use proper typography instead
```

### Section Organization

- **Guidelines**: High-level usage guidance
- **Best practices**: Specific implementation advice
- **When to use/When not to use**: Clear do's and don'ts
- **Accessibility considerations**: WCAG compliance guidance

## Props Documentation

### Using PropsTable

The PropsTable component automatically extracts props from your TypeScript
definitions:

```markdown
## Specs

<PropsTable id="ComponentName" />
```

The `id` must match the component's export name.

### Manual Props Tables (if needed)

```markdown
## Props

| Prop         | Type                              | Default   | Description    |
| ------------ | --------------------------------- | --------- | -------------- |
| `variant`    | `"solid" \| "outline" \| "ghost"` | `"solid"` | Visual variant |
| `size`       | `"sm" \| "md" \| "lg"`            | `"md"`    | Component size |
| `isDisabled` | `boolean`                         | `false`   | Disabled state |
```

## Accessibility Documentation

### Required Sections

```markdown
## Accessibility

This component is built with React Aria and follows WCAG 2.1 AA guidelines.

### Keyboard Navigation

| Key          | Action                       |
| ------------ | ---------------------------- |
| `Tab`        | Move focus to/from component |
| `Space`      | Activate when focused        |
| `Enter`      | Submit/Activate              |
| `Arrow Keys` | Navigate options             |
| `Escape`     | Close/Cancel operation       |

### Screen Reader Support

- Properly announces component role
- Provides state announcements
- Includes descriptive labels
- Supports live regions for updates

### ARIA Attributes

- `role="button"` - Identifies interactive element
- `aria-pressed` - Indicates toggle state
- `aria-disabled` - Announces disabled state
- `aria-label` - Provides accessible name
```

## Common Patterns from Nimbus Components

### Frontmatter Variations

#### Simple Component (Badge)
```yaml
---
id: Components-Badge
title: Badge
description: Briefly highlights or categorizes associated UI elements with concise visual cues for status or metadata.
documentState: InitialDraft
order: 999
menu:
  - Components
  - Data Display
  - Badge
tags:
  - component
---
```

#### Complex Component (Dialog)
```yaml
---
id: Components-Dialog
title: Dialog
description: A foundational dialog component for overlays that require user attention and interaction.
lifecycleState: Stable
order: 999
menu:
  - Components
  - Feedback
  - Dialog
tags:
  - component
  - overlay
  - dialog
  - interactive
figmaLink: >-
  https://www.figma.com/design/gHbAJGfcrCv7f2bgzUQgHq/NIMBUS-Guidelines?node-id=1695-45519&m
---
```

#### Component with Multiple States (Text Input)
```yaml
---
id: Components-TextInput
title: TextInput
description: An input component that takes in a text as input
documentState: InitialDraft
order: 999
menu:
  - Components
  - Inputs
  - TextInput
tags:
  - component
---
```

### Content Structure Patterns

#### Variables Section (Common Pattern)
```markdown
## Variables

Get familiar with the features.

### Size

#### Medium
This is the default size for text inputs.

\\`\\`\\`jsx-live
const App = () => <TextInput size=\"md\" value=\"input value\"/>
\\`\\`\\`

#### Small
Available for the times a more condensed text input is needed.

\\`\\`\\`jsx-live
const App = () => <TextInput size=\"sm\" value=\"input value\"/>
\\`\\`\\`
```

#### API Documentation Section
```markdown
## API

The Dialog component is structured as a compound component with multiple parts that work together:

### Dialog.Root

The root component that provides context and state management for the dialog.

**Props:**
- `isOpen?: boolean` - Controls the open state (controlled mode)
- `onOpenChange?: (isOpen: boolean) => void` - Callback when dialog state changes
```


## Available MDX Features

### Components Available Without Imports

- `<PropsTable id="ComponentName" />` - Auto-generated props table from TypeScript definitions
- Standard markdown formatting - Links, lists, tables, bold, italic, code
- Tables - For keyboard navigation, specs, and data presentation

### Code Blocks

- `jsx-live` - Interactive React components that render in the browser
- Standard code blocks with syntax highlighting

### GitHub-Style Features (If Supported)

- Alert blocks: `> [!TIP]`, `> [!CAUTION]`, `> [!WARNING]`, `> [!NOTE]`
- Task lists: `- [ ]` and `- [x]`

### Markdown Extensions

- **Frontmatter**: YAML metadata at the top of files
- **Line breaks**: Use `\` for explicit line breaks in alerts
- **Multi-line strings**: Use `>-` in frontmatter for long URLs

## Related Guidelines

- [Stories](./stories.md) - Storybook stories for testing
- [Types](./types.md) - Props definitions for PropsTable
- [Main Component](./main-component.md) - Component being documented

## Validation Checklist

### Required Elements
- [ ] MDX file exists with `.mdx` extension
- [ ] **Required frontmatter fields**: id, title, description, order, menu, tags
- [ ] Unique `id` field following `Components-{ComponentName}` pattern
- [ ] Proper `menu` hierarchy with category placement
- [ ] Tags array including `component` and relevant keywords
- [ ] H1 title matching component name
- [ ] Overview section explaining component purpose

### Content Requirements
- [ ] **Interactive examples using `jsx-live` blocks only**
- [ ] **NO Storybook-specific imports**
- [ ] Resources section with relevant external links
- [ ] Variables/Examples section showing component variations
- [ ] Code examples with proper formatting and indentation
- [ ] Realistic, production-ready code examples

### Documentation Standards
- [ ] Props documentation using `<PropsTable id="ComponentName" />`
- [ ] Guidelines section (optional but recommended)
- [ ] Accessibility section with WCAG compliance details
- [ ] Keyboard navigation table when applicable
- [ ] Screen reader support information
- [ ] External resource links (Figma, React Aria, ARIA patterns)

### Quality Checks
- [ ] All code examples are functional and realistic
- [ ] Proper component hierarchy demonstrated
- [ ] Accessibility features properly documented
- [ ] Consistent formatting throughout file
- [ ] No references to non-existent components or patterns

---

[← Back to Index](../component-guidelines.md) |
[Previous: Stories](./stories.md) | [Next: Recipes →](./recipes.md)
