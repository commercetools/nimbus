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

Based on `apps/docs/src/schemas/mdx-document.ts`, all MDX files must include:

```yaml
---
id: Components-ComponentName # Unique identifier
title: Component Name # Display name
description: Brief one-line description of the component
lifecycleState: Experimental|Alpha|Beta|Stable|Deprecated|EOL # Optional lifecycle indicator
order: 999 # Menu display order (999 = default)
menu: # Menu hierarchy
  - Components
  - Category
  - Component Name
tags: # Search tags
  - component
  - interactive
  - form
figmaLink: >- # Optional Figma design link
  https://www.figma.com/design/...
---
```

### Standard Content Structure

Follow this pattern (based on Alert component):

```markdown
# Component Name

Brief introduction paragraph explaining what the component is and when to use
it.

## Resources

<LinkCard url="{figmaLink}" title="Figma Design" />

## Examples

### Basic Usage

\`\`\`jsx-live const App = () => { return ( <ComponentName> Basic example
</ComponentName> ); }; \`\`\`

### With Options

\`\`\`jsx-live const App = () => { const [value, setValue] =
useState("option1");

return ( <ComponentName
      value={value}
      onChange={setValue}
    > Interactive example </ComponentName> ); }; \`\`\`

## Guidelines

<Callout variant="do">
  **Do:** Use this component for primary actions
</Callout>

<Callout variant="dont">
  **Don't:** Use for navigation (use Link instead)
</Callout>

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

## Code Examples

### Using jsx-live Blocks

**CRITICAL**: Use `jsx-live` blocks, NOT Storybook imports:

```markdown
✅ CORRECT - jsx-live block \`\`\`jsx-live const App = () => { return
<Button variant="solid">Click me</Button>; }; \`\`\`

Use jsx-live instead of Storybook imports for interactive examples
```

### Interactive Examples

```markdown
\`\`\`jsx-live const App = () => { const [count, setCount] = useState(0);

return ( <Stack gap="400"> <Text>Count: {count}</Text> <Button onClick={() =>
setCount(count + 1)}> Increment </Button> </Stack> ); }; \`\`\`
```

### Complex Examples

```markdown
\`\`\`jsx-live const App = () => { const [selected, setSelected] = useState(new
Set());

const handleSelectionChange = (keys) => { setSelected(keys); };

return ( <Select
      selectedKeys={selected}
      onSelectionChange={handleSelectionChange}
    > <Select.Trigger> {selected.size > 0 ? `Selected: ${selected.size}` :
"Select options"} </Select.Trigger> <Select.Content> <Select.Item
value="1">Option 1</Select.Item> <Select.Item value="2">Option 2</Select.Item>
<Select.Item value="3">Option 3</Select.Item> </Select.Content> </Select> ); };
\`\`\`
```

## Guidelines Section

### Using Callout Components

```markdown
## Guidelines

### When to Use

<Callout variant="do">
  **Do:** Use Button for actions that trigger immediate responses
</Callout>

<Callout variant="do">
  **Do:** Provide clear, action-oriented labels
</Callout>

<Callout variant="dont">
  **Don't:** Use Button for navigation - use Link instead
</Callout>

<Callout variant="dont">
  **Don't:** Use more than one primary Button per section
</Callout>

### Best Practices

<Callout variant="info">
  Group related actions together using ButtonGroup
</Callout>

<Callout variant="warning">
  Destructive actions should use the "danger" variant
</Callout>
```

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

## Common Patterns from Nimbus

### Simple Component (Button)

```yaml
---
id: Components-Button
title: Button
description: Buttons trigger actions or events
order: 10
menu:
  - Components
  - Actions
  - Button
tags:
  - component
  - action
  - interactive
---
```

### Compound Component (Menu)

```yaml
---
id: Components-Menu
title: Menu
description: Contextual overlay for displaying lists of actions
order: 50
menu:
  - Components
  - Overlays
  - Menu
tags:
  - component
  - menu
  - dropdown
  - overlay
---
```


## MDX Components Available

These components are available in MDX files without imports:

- `<PropsTable id="ComponentName" />` - Auto-generated props table
- `<Callout variant="do|dont|info|warning" />` - Guideline callouts
- `<LinkCard url="" title="" />` - External link cards
- `jsx-live` code blocks - Interactive examples

## Related Guidelines

- [Stories](./stories.md) - Storybook stories for testing
- [Types](./types.md) - Props definitions for PropsTable
- [Main Component](./main-component.md) - Component being documented

## Validation Checklist

- [ ] MDX file exists with `.mdx` extension
- [ ] All required frontmatter fields present
- [ ] Unique `id` field
- [ ] Proper `menu` hierarchy
- [ ] Relevant `tags` for search
- [ ] Overview section explaining purpose
- [ ] Interactive examples using `jsx-live`
- [ ] **NO Storybook-specific imports**
- [ ] Guidelines with Do/Don't callouts
- [ ] Props documentation (`<PropsTable />`)
- [ ] Accessibility section
- [ ] Keyboard navigation table
- [ ] Screen reader information
- [ ] Figma link (if available)

---

[← Back to Index](../component-guidelines.md) |
[Previous: Stories](./stories.md) | [Next: Recipes →](./recipes.md)
