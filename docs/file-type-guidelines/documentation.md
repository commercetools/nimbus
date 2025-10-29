# Component Documentation (MDX) Guidelines

[← Back to Index](../component-guidelines.md) |
[Previous: Stories](./stories.md) | [Next: Recipes →](./recipes.md)

## Purpose

MDX documentation files (`{component-name}.mdx`) provide comprehensive
documentation for components in the Nimbus documentation site. They combine
markdown content with live code examples.

## When to Use

**Always required** - Every public-facing component in the Nimbus design system
must have MDX documentation that:

- Explains the component's purpose and when to use it
- Shows usage examples with live code (using `jsx-live` blocks)
- Documents props and API (using `<PropsTable>` component)
- Provides accessibility information (keyboard navigation, ARIA attributes, WCAG
  compliance)
- Links to design resources (Figma, React Aria docs when applicable)

**Note**: Internal utility components or non-exported components don't require
MDX documentation.

## File Structure

### Required Frontmatter

Based on analysis of existing component MDX files, all files must include these
frontmatter fields:

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

Brief introduction paragraph explaining what the component is and when to use
it.

## Overview

Detailed explanation of the component's purpose, behavior, and primary use
cases.

### Key Features (Optional)

- **Feature 1**: Description
- **Feature 2**: Description
- **Feature 3**: Description

### Resources

Deep dive on details and access design library.

[Figma library](figmaLink) [React ARIA Docs](reactAriaLink) # If applicable
[ARIA Pattern](ariaPatternLink) # If applicable

## Variables (or Examples)

Get familiar with the features.

### Basic Usage

\`\`\`jsx-live const App = () => ( <ComponentName> Basic example
</ComponentName> ) \`\`\`

### Size Variants (If applicable)

Demonstrate all sizes in a single code block for easy comparison:

\`\`\`jsx-live const App = () => (
<Stack direction="row" gap="400" alignItems="center">
<ComponentName size="sm">Small</ComponentName>
<ComponentName size="md">Medium</ComponentName>
<ComponentName size="lg">Large</ComponentName> </Stack> ) \`\`\`

### Visual Variants (If applicable)

Demonstrate all visual variants in a single code block for easy comparison:

\`\`\`jsx-live const App = () => (
<Stack direction="row" gap="400" alignItems="center">
<ComponentName variant="solid">Solid</ComponentName>
<ComponentName variant="outline">Outline</ComponentName>
<ComponentName variant="ghost">Ghost</ComponentName> </Stack> ) \`\`\`

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

## Developer View Documentation (.dev.mdx)

### Overview

Components can optionally have a **developer view** that provides technical implementation details separate from the design-focused documentation. This is achieved by creating a `.dev.mdx` file alongside the main `.mdx` file.

**Key Benefits:**
- **Audience Separation**: Design/product teams see design guidelines; developers see technical details
- **All Content Accessible**: Both audiences can access all content via tabs
- **Maintainable**: Separate files prevent documentation from becoming unwieldy
- **Optional**: Only create when there's substantial developer-specific content

### When to Create .dev.mdx Files

Create a `.dev.mdx` file when your component has:

- **Complex TypeScript patterns** requiring detailed explanation
- **Advanced usage examples** beyond basic component usage
- **Implementation details** (React Aria integration, custom hooks, state management)
- **Performance considerations** or optimization guidance
- **Testing strategies** specific to the component
- **Migration guides** from previous versions
- **Technical architecture** explanations

**Don't create .dev.mdx** if:
- Component is simple with straightforward usage
- Technical details fit naturally in the main documentation
- No audience-specific content distinction is needed

### File Location and Naming

Developer view files must follow this naming convention:

```
src/components/{component-name}/
├── {component-name}.mdx        # Main documentation (design view)
└── {component-name}.dev.mdx    # Developer documentation (dev view)
```

**Examples:**
- `button.mdx` + `button.dev.mdx`
- `text-input.mdx` + `text-input.dev.mdx`
- `date-picker.mdx` + `date-picker.dev.mdx`

### Content Split Recommendations

#### Main .mdx File (Design View)

**Focus on:**
- Visual appearance and behavior
- When to use the component
- Design guidelines and best practices
- Basic usage examples
- Accessibility from a user perspective
- Figma design resources

**Example content:**
```markdown
# Button

A clickable element that triggers actions or navigation.

## Overview

Buttons are used to initialize actions, either in forms, dialogs, or elsewhere.

### Resources

[Figma library](figmaLink)
[ARIA Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)

## Variables

Get familiar with the features.

### Variants

```jsx-live
const App = () => (
  <Stack direction="row" gap="400">
    <Button variant="solid">Solid</Button>
    <Button variant="outline">Outline</Button>
    <Button variant="ghost">Ghost</Button>
  </Stack>
);
```

## Guidelines

### Best practices

- Use clear, action-oriented labels
- Provide visual feedback on interaction
- Maintain consistent button hierarchy
```

#### .dev.mdx File (Developer View)

**Focus on:**
- TypeScript interfaces and type usage
- Implementation details (React Aria integration)
- Advanced usage patterns (controlled components, refs)
- Performance optimization techniques
- Testing strategies
- Technical accessibility implementation
- Integration with other components/systems

**Example content:**
```markdown
# Button Developer Guide

Technical documentation for implementing and using the Button component.

## API Reference

<PropsTable id="Button" />

## TypeScript Usage

```tsx
import { Button } from '@commercetools/nimbus';
import type { ButtonProps } from '@commercetools/nimbus';

const MyButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props}>Click me</Button>;
};

// Type-safe variant usage
const variant: ButtonProps['variant'] = 'solid';
```

## Implementation Details

The Button component is built using React Aria's Button component for accessibility.

### Architecture

- **Foundation**: React Aria Components `Button`
- **Styling**: Chakra UI recipe system with slot components
- **State Management**: Controlled via React Aria's built-in state

### Key Features

- **Accessible by default**: WCAG 2.1 AA compliant
- **Keyboard navigation**: Full keyboard support
- **Focus management**: Automatic focus handling
- **Loading states**: Built-in support for async actions

## Advanced Usage

### Ref Forwarding

```tsx
import { useRef } from 'react';
import { Button } from '@commercetools/nimbus';

const MyComponent = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  return <Button ref={buttonRef}>Click me</Button>;
};
```

### With React Hook Form

```tsx
import { useForm } from 'react-hook-form';
import { Button } from '@commercetools/nimbus';

const MyForm = () => {
  const { handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Button type="submit">Submit</Button>
    </form>
  );
};
```

## Performance Considerations

- Button renders are optimized using React.memo
- Use `isLoading` prop instead of conditional rendering for async states
- Icon components are lazy-loaded when used

## Testing

### Unit Testing

```tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@commercetools/nimbus';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
});
```

### Accessibility Testing

```tsx
import { axe } from 'jest-axe';

test('button has no accessibility violations', async () => {
  const { container } = render(<Button>Click me</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```
```

### How It Works

When a `.dev.mdx` file exists:

1. **Build System**:
   - The build process detects both files during component scanning
   - Both files are parsed and bundled into a single route JSON file
   - The route manifest flags the component with `hasDevView: true`

2. **UI Presentation**:
   - A tab switcher appears at the top of the documentation page
   - "Design" tab shows content from `{component-name}.mdx`
   - "Developer" tab shows content from `{component-name}.dev.mdx`
   - Tab state syncs with URL query parameter (`?view=design` or `?view=dev`)

3. **URL Handling**:
   - `/components/button` - Default design view
   - `/components/button?view=design` - Explicit design view
   - `/components/button?view=dev` - Developer view
   - URLs are shareable and bookmarkable

### Best Practices

#### Content Organization

**✅ DO:**
- Keep design view focused on visual and UX concerns
- Put TypeScript types and interfaces in developer view
- Include basic usage in design view; advanced patterns in developer view
- Share PropsTable between both views when beneficial
- Maintain consistent headings across both files for easier navigation

**❌ DON'T:**
- Duplicate content between files - reference instead
- Hide critical information behind the wrong view
- Create dev view just for a single technical note
- Forget to update both files when making changes

#### Frontmatter

The `.dev.mdx` file does NOT need frontmatter - it inherits metadata from the main `.mdx` file. Just start with your content:

```markdown
# Component Name Developer Guide

Your developer-focused content starts here...
```

#### Cross-Referencing

You can reference content between views:

```markdown
<!-- In design view -->
For technical implementation details, see the Developer view.

<!-- In developer view -->
For usage guidelines and design patterns, see the Design view.
```

#### Maintaining Consistency

- Use the same heading structure (h1, h2, h3 levels)
- Keep the same component name in the h1 title
- Maintain similar section organization for easier mental model
- Update both files when component API changes

### Examples from Nimbus

The Button component demonstrates this pattern:

**button.mdx** - Design view focuses on:
- Visual variants (solid, outline, ghost)
- Size options (sm, md, lg)
- When to use buttons
- Design best practices
- Basic interaction examples

**button.dev.mdx** - Developer view includes:
- PropsTable with all TypeScript interfaces
- TypeScript usage examples
- Implementation details (React Aria integration)
- Advanced usage patterns (ref forwarding, form integration)
- Performance considerations
- Testing examples

## Code Examples

### jsx-live Block Requirements

**CRITICAL**: All interactive examples must use `jsx-live` blocks. These blocks
render live, interactive React components in the documentation site.

```markdown
\`\`\`jsx-live const App = () => ( <Button variant="solid">Click me</Button> )
\`\`\`
```

**Key points**:

- All Nimbus components (Button, Stack, Icons, etc.) are available globally - no
  imports needed
- Each jsx-live block should define an `App` component
- The code executes in the browser and renders as a live component
- Use regular markdown code blocks (with language tags like `jsx` or `tsx`) only
  for non-interactive code examples

**Note**: MDX files are for documentation. Use `.stories.tsx` files for
Storybook content.

### Code Example Patterns

#### Simple Component Example

```markdown
\`\`\`jsx-live const App = () => ( <Badge colorPalette="primary" size="md">
<Icons.SentimentSatisfied /> Badge <Icons.SentimentSatisfied /> </Badge> )
\`\`\`
```

#### Interactive State Example

```markdown
\`\`\`jsx-live const App = () => { const [count, setCount] = useState(0);

return ( <Stack direction="column" gap="400"> <Text>Count: {count}</Text>
<Button onClick={() => setCount(count + 1)}> Increment </Button> </Stack> ); }
\`\`\`
```

#### Compound Component Example

```markdown
\`\`\`jsx-live const App = () => ( <Menu.Root> <Menu.Trigger> Actions
<Icons.KeyboardArrowDown /> </Menu.Trigger> <Menu.Content> <Menu.Item
id="copy">Copy</Menu.Item> <Menu.Item id="paste">Paste</Menu.Item> <Menu.Item
id="delete">Delete</Menu.Item> </Menu.Content> </Menu.Root> ) \`\`\`
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

Text input guidelines focus on creating clear, accessible, and user-friendly
fields.

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
definitions and displays them in a formatted table:

```markdown
## Specs

<PropsTable id="ComponentName" />
```

**The `id` parameter**:

- For simple components: Use the component's export name (e.g., `"Button"`)
- For compound components: Use the base namespace name (e.g., `"Menu"` not
  `"Menu.Root"`)
- The ID is case-sensitive and must match exactly
- If the component isn't found, PropsTable will display an error message in the
  docs

**Requirements**:

- Component must have a TypeScript interface exported in the types file
- Props interface should follow naming convention: `{ComponentName}Props`

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
description:
  Briefly highlights or categorizes associated UI elements with concise visual
  cues for status or metadata.
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
description:
  A foundational dialog component for overlays that require user attention and
  interaction.
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

This section demonstrates component variants and options. Example structure:

```markdown
## Variables

Get familiar with the features.

### Size

#### Medium

This is the default size for text inputs.

[jsx-live code block here showing medium size]

#### Small

Available for the times a more condensed text input is needed.

[jsx-live code block here showing small size]
```

See actual MDX files in the codebase (e.g., `text-input.mdx`, `button.mdx`) for
complete working examples.

#### API Documentation Section

```markdown
## API

The Dialog component is structured as a compound component with multiple parts
that work together:

### Dialog.Root

The root component that provides context and state management for the dialog.

**Props:**

- `isOpen?: boolean` - Controls the open state (controlled mode)
- `onOpenChange?: (isOpen: boolean) => void` - Callback when dialog state
  changes
```

## Available MDX Features

### Components Available Without Imports

These components work automatically in MDX files without import statements:

- `<PropsTable id="ComponentName" />` - Auto-generated props table from
  TypeScript definitions
- All Nimbus components (Button, Stack, Icons, etc.) - Available globally
- Standard markdown formatting - Links, lists, tables, bold, italic, code
- Markdown tables - For keyboard navigation, specs, and data presentation

### Code Blocks

- `jsx-live` - **Required for all interactive examples** - Renders live React
  components in the browser
- Standard code blocks - For non-interactive code examples with syntax
  highlighting

### GitHub-Style Features

Supported in the Nimbus documentation site:

- Alert blocks: `> [!TIP]`, `> [!CAUTION]`, `> [!WARNING]`, `> [!NOTE]`
- Task lists: `- [ ]` and `- [x]`
- Line breaks in alerts: Use `\` at end of line

### Markdown Extensions

- **Frontmatter**: YAML metadata at the top of files
- **Line breaks**: Use `\` for explicit line breaks in alerts
- **Multi-line strings**: Use `>-` in frontmatter for long URLs

## Related Guidelines

- [Stories](./stories.md) - Storybook stories for testing
- [Types](./types.md) - Props definitions for PropsTable
- [Main Component](./main-component.md) - Component being documented

## Validation Checklist

### Required Elements (Main .mdx File)

- [ ] MDX file exists with `.mdx` extension
- [ ] **Required frontmatter fields**: id, title, description, order, menu, tags
- [ ] Unique `id` field following `Components-{ComponentName}` pattern
- [ ] Proper `menu` hierarchy with category placement
- [ ] Tags array including `component` and relevant keywords
- [ ] H1 title matching component name
- [ ] Overview section explaining component purpose

### Content Requirements (Main .mdx File)

- [ ] **Interactive examples using `jsx-live` blocks only**
- [ ] **NO Storybook-specific imports**
- [ ] Resources section with relevant external links
- [ ] Variables/Examples section showing component variations
- [ ] **Sizes demonstrated in a single code block** (not separate blocks per
      size)
- [ ] **Variants demonstrated in a single code block** (not separate blocks per
      variant)
- [ ] Code examples with proper formatting and indentation
- [ ] Realistic, production-ready code examples

### Documentation Standards

- [ ] Props documentation using `<PropsTable id="ComponentName" />`
- [ ] Guidelines section (optional but recommended)
- [ ] Accessibility section with WCAG compliance details
- [ ] Keyboard navigation table when applicable
- [ ] Screen reader support information
- [ ] External resource links (Figma, React Aria, ARIA patterns)

### Developer View (.dev.mdx File) - When Present

- [ ] **File naming**: `{component-name}.dev.mdx` matches main file
- [ ] **No frontmatter** in .dev.mdx (inherits from main file)
- [ ] H1 title includes "Developer Guide" or similar
- [ ] Content is developer-focused (TypeScript, implementation, testing)
- [ ] No duplicate content from design view (reference instead)
- [ ] PropsTable included if beneficial for developers
- [ ] TypeScript usage examples provided
- [ ] Advanced usage patterns documented
- [ ] Testing examples included where applicable
- [ ] Performance considerations noted when relevant

### Quality Checks

- [ ] All code examples are functional and realistic
- [ ] Proper component hierarchy demonstrated
- [ ] Accessibility features properly documented
- [ ] Consistent formatting throughout file(s)
- [ ] No references to non-existent components or patterns
- [ ] **If .dev.mdx exists**: Content appropriately split between views
- [ ] **If .dev.mdx exists**: Both files updated together when API changes

---

[← Back to Index](../component-guidelines.md) |
[Previous: Stories](./stories.md) | [Next: Recipes →](./recipes.md)
