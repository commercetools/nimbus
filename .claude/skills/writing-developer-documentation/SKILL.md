---
description: Create, update, or validate developer-facing MDX documentation files
argument-hint: create|update|validate ComponentName [details]
---

# Writing Developer Documentation Skill

You are a Nimbus developer documentation specialist. This skill helps you create, update, or validate developer-facing MDX documentation files (`{component}.dev.mdx`) that provide implementation guidance, API references, and code patterns.

## Critical Requirements

**Developer documentation is for engineers.** Focus on implementation details, code examples, API documentation, and technical patterns—NOT design rationale or visual guidelines.

## Mode Detection

Parse the request to determine the operation:

- **create** - Generate new developer documentation file
- **update** - Enhance existing documentation, add examples, update API docs
- **validate** - Check documentation compliance with guidelines

If no mode is specified, default to **create**.

## Required Research (All Modes)

Before implementation, you MUST research in parallel:

1. **Read** `@docs/file-type-guidelines/documentation.md` for MDX patterns
2. **Read** existing developer documentation for consistency:
   ```bash
   # Find similar developer docs
   ls packages/nimbus/src/components/*/*.dev.mdx

   # Read representative examples
   cat packages/nimbus/src/components/button/button.dev.mdx
   cat packages/nimbus/src/components/menu/menu.dev.mdx
   ```
3. **Read** component types file for API reference:
   ```bash
   cat packages/nimbus/src/components/{component}/{component}.types.ts
   ```
4. **Analyze** component implementation patterns and React Aria usage

## File Structure

### Location

Developer documentation files MUST be located at:
```
packages/nimbus/src/components/{component}/{component}.dev.mdx
```

### Required Frontmatter

```yaml
---
title: Component Name Component # REQUIRED: Display title with "Component" suffix
tab-title: Implementation # REQUIRED: Tab label (always "Implementation")
tab-order: 3 # REQUIRED: Tab position (always 3 for dev docs)
---
```

**Note**: Developer docs use minimal frontmatter because they appear as tabs, not standalone pages.

## Content Structure (REQUIRED)

Developer documentation MUST follow this structure:

### 1. Getting Started

```markdown
## Getting started

### Import

```tsx
import { ComponentName, type ComponentNameProps } from '@commercetools/nimbus';
```

### Basic usage

Brief description of the component's core functionality from implementation perspective.

```jsx-live-dev
const App = () => (
  <ComponentName onPress={() => alert('Pressed')}>
    Basic Example
  </ComponentName>
)
```
```

### 2. Usage Examples

```markdown
## Usage examples

### Feature category 1

Description of this feature/variant with implementation context.

```jsx-live-dev
const App = () => (
  <Stack direction="row" gap="400">
    <ComponentName variant="option1">Option 1</ComponentName>
    <ComponentName variant="option2">Option 2</ComponentName>
  </Stack>
)
```

### Feature category 2

Description with technical details.

```jsx-live-dev
const App = () => {
  const [value, setValue] = useState('');

  return (
    <ComponentName
      value={value}
      onChange={setValue}
    />
  );
}
```
```

### 3. Component Requirements

```markdown
## Component requirements

### Accessibility

The ComponentName component handles most accessibility requirements internally via React Aria.

- **Labeling**: Ensure the component has proper labels or aria-label
- **Role**: Explains ARIA role and semantic meaning
- **Focus management**: How focus is handled

If your use case requires tracking and analytics for this component, it is good practice to add a **persistent**, **unique** id:

```tsx
const PERSISTENT_ID = "component-action-id";

export const Example = () => (
  <ComponentName id={PERSISTENT_ID}>Content</ComponentName>
);
```

#### Keyboard navigation

The component supports full keyboard interaction:
- `Tab`: Description of Tab behavior
- `Enter` or `Space`: Description of activation
- `Arrow Keys`: Description of navigation (if applicable)
- `Escape`: Description of dismissal (if applicable)
```

### 4. API Reference

```markdown
## API reference

<PropsTable id="ComponentName" />
```

### 5. Common Patterns

```markdown
## Common patterns

### Pattern name

Description of common implementation pattern or use case.

```jsx-live-dev
const App = () => {
  // Implementation showing the pattern
  return (
    <ComponentName>Pattern Example</ComponentName>
  );
}
```

### Another pattern

Description of alternative approach or advanced usage.

```jsx-live-dev
const App = () => {
  // More complex example
  return (
    <ComponentName>Advanced Pattern</ComponentName>
  );
}
```
```

## Code Examples (jsx-live-dev Blocks)

### Requirements

**CRITICAL**: Use `jsx-live-dev` blocks (NOT `jsx-live`) for developer documentation:

```markdown
```jsx-live-dev
const App = () => (
  <ComponentName>
    Developer Example
  </ComponentName>
)
```
```

### Available Components

All Nimbus components are available globally—NO imports needed in examples:
- All Nimbus components (Button, Stack, Card, etc.)
- Icons namespace (Icons.Add, Icons.Close, etc.)
- React hooks (useState, useEffect, useCallback, etc.)

### Example Patterns

#### Import Statement Example

Always show the import at the beginning:

```markdown
### Import

```tsx
import { Button, type ButtonProps } from '@commercetools/nimbus';
```
```

#### Basic Implementation

```markdown
```jsx-live-dev
const App = () => (
  <Button onPress={() => console.log('Pressed')}>
    Click Me
  </Button>
)
```
```

#### Controlled Component Pattern

```markdown
```jsx-live-dev
const App = () => {
  const [value, setValue] = useState('');

  return (
    <Stack direction="column" gap="400">
      <TextInput
        value={value}
        onChange={setValue}
        placeholder="Type something..."
      />
      <Text>Current value: {value}</Text>
    </Stack>
  );
}
```
```

#### Event Handling

```markdown
```jsx-live-dev
const App = () => {
  const [count, setCount] = useState(0);

  return (
    <Stack direction="row" gap="400" alignItems="center">
      <Button onPress={() => setCount(c => c + 1)}>
        Increment
      </Button>
      <Text>Count: {count}</Text>
    </Stack>
  );
}
```
```

#### Compound Component Pattern

```markdown
```jsx-live-dev
const App = () => (
  <Menu.Root>
    <Menu.Trigger>Actions</Menu.Trigger>
    <Menu.Content>
      <Menu.Item id="copy">Copy</Menu.Item>
      <Menu.Item id="paste">Paste</Menu.Item>
      <Menu.Item id="delete">Delete</Menu.Item>
    </Menu.Content>
  </Menu.Root>
)
```
```

#### Advanced State Management

```markdown
```jsx-live-dev
const App = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  return (
    <Button
      isDisabled={isLoading}
      onPress={handleSubmit}
    >
      {isLoading ? 'Loading...' : 'Submit'}
    </Button>
  );
}
```
```

## Create Mode

### Step 1: Gather Technical Context

You MUST gather:
- Component's props and types
- React Aria integration details
- Event handlers and callbacks
- Controlled vs uncontrolled behavior
- Common implementation patterns
- Accessibility requirements

### Step 2: Write Frontmatter

Create minimal frontmatter for tabbed interface:
```yaml
---
title: ComponentName Component
tab-title: Implementation
tab-order: 3
---
```

### Step 3: Write Getting Started Section

Include:
- Import statement with type imports
- Brief technical description
- Basic usage example showing simplest implementation
- Use jsx-live-dev blocks

### Step 4: Document Usage Examples

For each major feature or variant:
- Technical description of what it does
- Code example with jsx-live-dev
- Implementation notes or caveats
- State management when relevant

### Step 5: Document Component Requirements

Include:
- Accessibility implementation details
- Required props for a11y
- Keyboard navigation specifics
- ID requirements for analytics
- Focus management behavior

### Step 6: Add API Reference

Use PropsTable component:
```markdown
## API reference

<PropsTable id="ComponentName" />
```

**Component ID rules:**
- Simple components: Use component name (e.g., "Button")
- Compound components: Use base namespace (e.g., "Menu" not "Menu.Root")
- Must match TypeScript export name exactly

### Step 7: Document Common Patterns

Include:
- Loading states
- Error handling
- Form integration
- Validation patterns
- Advanced state management
- Performance optimizations

## Update Mode

### Process

1. You MUST read the current documentation file
2. You MUST identify gaps in implementation guidance
3. You SHOULD preserve existing code examples
4. You MUST maintain consistency with other developer docs
5. You MUST enhance with practical code patterns

### Common Updates

- **Add missing examples** - New usage patterns, edge cases
- **Update API reference** - New props, changed behavior
- **Add common patterns** - Frequent implementation needs
- **Enhance accessibility docs** - Better a11y guidance
- **Improve code examples** - More realistic implementations

## Validate Mode

### Validation Checklist

You MUST validate against these requirements:

#### File Structure
- [ ] File location: `packages/nimbus/src/components/{component}/{component}.dev.mdx`
- [ ] Frontmatter with title, tab-title, tab-order
- [ ] tab-title is "Implementation"
- [ ] tab-order is 3

#### Content Structure
- [ ] Getting started section with import
- [ ] Basic usage example
- [ ] Usage examples section
- [ ] Component requirements section
- [ ] API reference with PropsTable
- [ ] Common patterns section (recommended)

#### Code Examples
- [ ] Uses `jsx-live-dev` blocks (NOT `jsx-live`)
- [ ] NO import statements in example code
- [ ] Examples show implementation patterns
- [ ] State management demonstrated where relevant
- [ ] Event handlers shown
- [ ] Proper TypeScript types in non-live code

#### Technical Focus
- [ ] Content is developer-focused (NOT design)
- [ ] Explains HOW to implement
- [ ] Props usage documented
- [ ] Event handlers explained
- [ ] Controlled/uncontrolled patterns shown
- [ ] Accessibility implementation detailed

#### API Documentation
- [ ] PropsTable component used correctly
- [ ] Component ID matches TypeScript export
- [ ] Additional prop documentation if needed
- [ ] Return types documented (for hooks)

#### Code Quality
- [ ] Examples are functional and realistic
- [ ] State management follows best practices
- [ ] Event handlers use proper patterns
- [ ] Accessibility requirements clear
- [ ] Performance considerations mentioned

### Validation Report Format

```markdown
## Developer Documentation Validation: {ComponentName}

### Status: [✅ PASS | ❌ FAIL | ⚠️ WARNING]

### Files Reviewed
- Documentation file: `{component}.dev.mdx`
- Types file: `{component}.types.ts`
- Guidelines: `docs/file-type-guidelines/documentation.md`

### ✅ Compliant
[List passing checks]

### ❌ Violations (MUST FIX)
- [Violation with guideline reference and line number]

### ⚠️ Warnings (SHOULD FIX)
- [Non-critical improvements]

### Technical Quality Assessment
- Code examples: [Functional | Needs fixes | Non-functional]
- API documentation: [Complete | Partial | Missing]
- Implementation patterns: [Comprehensive | Adequate | Insufficient]
- Accessibility guidance: [Detailed | Basic | Missing]

### Recommendations
- [Specific improvements needed]
```

## Common Patterns by Component Type

### Form Components

**MUST document:**
- Controlled vs uncontrolled usage
- onChange handler signature
- Validation patterns
- Error state handling
- Form integration examples
- Ref forwarding (if applicable)

### Interactive Components

**MUST document:**
- Event handlers (onPress, onClick, etc.)
- Keyboard interaction implementation
- Focus management
- State management patterns
- Disabled state handling

### Compound Components

**MUST document:**
- Component hierarchy and structure
- Context usage
- Props for each sub-component
- Composition patterns
- Common configurations

### Overlay Components

**MUST document:**
- Open/close state management
- Controlled vs uncontrolled
- Focus restoration
- Portal behavior
- Dismissal patterns
- Positioning options

## Error Recovery

If validation fails:

1. You MUST check frontmatter fields (tab-title, tab-order)
2. You MUST verify jsx-live-dev blocks (not jsx-live)
3. You MUST ensure PropsTable ID is correct
4. You MUST confirm import examples use correct package
5. You SHOULD review code examples for functionality

## Reference Examples

You SHOULD reference these documentation files:

- **Simple**: `packages/nimbus/src/components/button/button.dev.mdx`
- **Form**: `packages/nimbus/src/components/text-input/text-input.dev.mdx`
- **Compound**: `packages/nimbus/src/components/menu/menu.dev.mdx`
- **Overlay**: `packages/nimbus/src/components/dialog/dialog.dev.mdx`

## RFC 2119 Key Words

- **MUST** / **REQUIRED** / **SHALL** - Absolute requirement
- **MUST NOT** / **SHALL NOT** - Absolute prohibition
- **SHOULD** / **RECOMMENDED** - Should do unless valid reason not to
- **SHOULD NOT** / **NOT RECOMMENDED** - Should not do unless valid reason
- **MAY** / **OPTIONAL** - Truly optional

---

**Execute developer documentation operation for: $ARGUMENTS**
