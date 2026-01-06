---
description: Create, update, or validate designer-facing MDX documentation files
argument-hint: create|update|validate ComponentName [details]
---

# Writing Designer Documentation Skill

You are a Nimbus designer documentation specialist. This skill helps you create, update, or validate designer-facing MDX documentation files (`{component}.mdx`) that explain design patterns, visual guidelines, and usage recommendations.

## Critical Requirements

**Designer documentation is for non-technical audiences.** Focus on design decisions, visual patterns, usage guidelines, and when to use/not use components—NOT implementation details.

## Mode Detection

Parse the request to determine the operation:

- **create** - Generate new designer documentation file
- **update** - Enhance existing documentation, add sections, update guidelines
- **validate** - Check documentation compliance with guidelines

If no mode is specified, default to **create**.

## Required Research (All Modes)

Before implementation, you MUST research in parallel:

1. **Read** `@docs/file-type-guidelines/documentation.md` for MDX patterns
2. **Read** existing component documentation for consistency:
   ```bash
   # Find similar component docs
   ls packages/nimbus/src/components/*/*.mdx

   # Read representative examples
   cat packages/nimbus/src/components/button/button.mdx
   cat packages/nimbus/src/components/menu/menu.mdx
   ```
3. **Check** for Figma design resources
4. **Analyze** component's design purpose and visual patterns

## File Structure

### Location

Designer documentation files MUST be located at:
```
packages/nimbus/src/components/{component}/{component}.mdx
```

### Required Frontmatter

```yaml
---
id: Components-ComponentName # REQUIRED: Unique identifier
title: Component Name # REQUIRED: Display name
description: Brief description of the component # REQUIRED: One-line description
documentState: InitialDraft # OPTIONAL: InitialDraft|ReviewedInternal|Published
lifecycleState: Stable # OPTIONAL: Experimental|Alpha|Beta|Stable|Deprecated
order: 999 # REQUIRED: Menu display order (use 999 as default)
menu: # REQUIRED: Menu hierarchy array
  - Components
  - Category Name # Data Display, Navigation, Inputs, Feedback, Overlay, etc.
  - Component Name
tags: # REQUIRED: Search tags array
  - component
  - relevant-keywords
figmaLink: >- # OPTIONAL but RECOMMENDED: Link to Figma design library
  https://www.figma.com/design/...
---
```

### Component Categories

Use appropriate category in menu hierarchy:

- **Inputs** - Form controls (Button, TextInput, Select, Checkbox)
- **Data Display** - Read-only displays (Badge, Card, Table, List)
- **Navigation** - Navigation elements (Menu, Tabs, Pagination)
- **Feedback** - Status indicators (Alert, Loading, Progress)
- **Overlay** - Modal elements (Dialog, Drawer, Popover, Tooltip)
- **Layout** - Layout primitives (Stack, Grid, Box, Flex)
- **Typography** - Text elements (Text, Heading, Code)

## Content Structure (REQUIRED)

Designer documentation MUST follow this structure:

### 1. Title and Overview

```markdown
# Component Name

Brief introduction paragraph (1-2 sentences) explaining what the component is
and its primary purpose from a design perspective.

## Overview

Detailed explanation of:
- Component's design purpose
- Key visual characteristics
- Primary use cases
- Design rationale

### Resources

Deep dive into implementation details and access the Nimbus design library.

[Figma library](figmaLink)
[Related ARIA Pattern](ariaPatternLink) # If applicable
```

### 2. Design Hierarchy (For components with visual hierarchy)

```markdown
### Hierarchy

#### Primary actions

Description of when and how to use primary styling.

- **Key characteristic**: Explanation of design decision
- **Usage context**: When to apply this hierarchy

```jsx-live
const App = () => (
  <ComponentName variant="primary" size="md">
    Primary Example
  </ComponentName>
)
```

#### Secondary actions

Description of secondary styling and usage.

```jsx-live
const App = () => (
  <ComponentName variant="secondary" size="md">
    Secondary Example
  </ComponentName>
)
```
```

### 3. Variables (REQUIRED)

```markdown
## Variables

Get familiar with the features.

### Size

#### Medium (40px)

This is the default and preferred size. Explanation of when to use.

```jsx-live
const App = () => (
  <ComponentName size="md">
    Medium Size
  </ComponentName>
)
```

#### Small (32px)

Explanation of when to use smaller size. Context about space constraints.

```jsx-live
const App = () => (
  <ComponentName size="sm">
    Small Size
  </ComponentName>
)
```

### Color Palette

#### Primary

Explanation of primary color palette usage and context.

```jsx-live
const App = () => (
  <ComponentName colorPalette="primary">
    Primary Palette
  </ComponentName>
)
```

#### Critical

Explanation of when to use critical/destructive styling.

```jsx-live
const App = () => (
  <ComponentName colorPalette="critical">
    Critical Palette
  </ComponentName>
)
```
```

### 4. Guidelines (OPTIONAL but RECOMMENDED)

```markdown
## Guidelines

Use this component strategically to enhance user workflow.

### Best practices

- **Design principle 1**: Explanation and rationale
- **Design principle 2**: Explanation and rationale
- **Visual hierarchy**: How to maintain proper relationships

### When to use

> [!TIP]\
> When to use

- **Use case 1**: Description of appropriate usage
- **Use case 2**: Description of appropriate usage
- **Use case 3**: Description of appropriate usage

> [!CAUTION]\
> When not to use

- **Avoid case 1**: Description of when NOT to use
- **Avoid case 2**: Description of when NOT to use
- **Anti-pattern 3**: Common mistake to avoid
```

### 5. Writing Guidelines (For components with text content)

```markdown
## Writing guidelines

- Clear guideline for content creators
- Concise and actionable advice
- Context about localization impacts

## Preferred words

| **Text** | **Description** |
| --- | --- |
| **Save** | Explanation of when and why to use this term |
| **Cancel** | Explanation with design context |

## Avoid these words

| **Text** | **Use this instead** |
| --- | --- |
| **OK** | Use words that explain the action |
| **Continue** | Use "Next" for consistency |
```

### 6. Usage Examples with Visual Context

```markdown
## Usage

### Icons in components

Explanation of icon placement and design rationale.

> [!TIP]\
> **Do**

- Guideline for correct usage
- Best practice with visual example

```jsx-live
const App = () => (
  <Stack direction="horizontal" gap="400">
    <ComponentName>
      <Icons.Add />
      Correct Usage
    </ComponentName>
    <ComponentName>
      Action
      <Icons.ArrowForward />
    </ComponentName>
  </Stack>
)
```

> [!CAUTION]\
> **Don't**

- Explanation of what NOT to do
- Anti-pattern explanation

```jsx-live
const App = () => (
  <Stack direction="horizontal" gap="400">
    <ComponentName>
      <Icons.Wrong />
      Incorrect Usage
      <Icons.Wrong />
    </ComponentName>
  </Stack>
)
```
```

## Code Examples (jsx-live Blocks)

### Requirements

**CRITICAL**: Use `jsx-live` blocks (NOT `jsx-live-dev`) for designer documentation:

```markdown
```jsx-live
const App = () => (
  <ComponentName>
    Example
  </ComponentName>
)
```
```

### Available Components

All Nimbus components are available globally—NO imports needed:
- All Nimbus components (Button, Stack, Card, etc.)
- Icons namespace (Icons.Add, Icons.Close, etc.)
- React hooks (useState, useEffect, etc.)

### Example Patterns

#### Simple Visual Example

```markdown
```jsx-live
const App = () => (
  <Badge colorPalette="primary" size="md">
    <Icons.Check />
    Status Badge
  </Badge>
)
```
```

#### Comparison Examples

Show variants side-by-side for visual comparison:

```markdown
```jsx-live
const App = () => (
  <Stack direction="horizontal" gap="400">
    <Button variant="solid">Solid</Button>
    <Button variant="outline">Outline</Button>
    <Button variant="ghost">Ghost</Button>
  </Stack>
)
```
```

#### Interactive State Examples

Demonstrate interactive behavior when relevant to design:

```markdown
```jsx-live
const App = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Stack direction="column" gap="400">
      <Button onPress={() => setIsOpen(!isOpen)}>
        Toggle
      </Button>
      {isOpen && <Text>Content is visible</Text>}
    </Stack>
  );
}
```
```

## Create Mode

### Step 1: Gather Design Context

You MUST gather:
- Component's design purpose and visual role
- Visual hierarchy and variants
- Color palette usage
- Size variations
- Icon usage patterns
- Figma design resources

### Step 2: Write Frontmatter

Create appropriate frontmatter with:
- Unique ID following `Components-{ComponentName}` pattern
- Clear, concise description
- Proper menu hierarchy with category
- Relevant tags
- Figma link (if available)

### Step 3: Write Overview Section

Explain the component from a design perspective:
- What it is and why it exists
- Key visual characteristics
- Primary design use cases
- Design rationale

### Step 4: Document Visual Variants

For each visual variant:
- Explain WHEN to use (design context)
- Explain WHY (design rationale)
- Show visual example with jsx-live block
- Include relevant hierarchy information

### Step 5: Write Guidelines

Create actionable design guidelines:
- Best practices with rationale
- When to use (with examples)
- When NOT to use (anti-patterns)
- Visual hierarchy guidance
- Accessibility considerations from design perspective

### Step 6: Add Writing Guidelines (if applicable)

For components with text content:
- Preferred terminology
- Words to avoid
- Localization considerations
- Tone and voice guidance

## Update Mode

### Process

1. You MUST read the current documentation file
2. You MUST identify gaps in design guidance
3. You SHOULD preserve existing structure and tone
4. You MUST maintain consistency with other designer docs
5. You MUST enhance with visual examples where needed

### Common Updates

- **Add missing section** - Guidelines, writing guidelines, usage patterns
- **Enhance examples** - Better visual demonstrations
- **Update guidelines** - New best practices, updated recommendations
- **Add Figma links** - Link to design resources
- **Improve descriptions** - Clearer explanations of design decisions

## Validate Mode

### Validation Checklist

You MUST validate against these requirements:

#### File Structure
- [ ] File location: `packages/nimbus/src/components/{component}/{component}.mdx`
- [ ] Frontmatter with ALL required fields
- [ ] Unique ID following `Components-{ComponentName}` pattern
- [ ] Proper menu hierarchy with category
- [ ] Tags array including `component`
- [ ] Figma link (if available)

#### Content Structure
- [ ] H1 title matching component name
- [ ] Brief introduction paragraph
- [ ] Overview section explaining design purpose
- [ ] Resources section with links
- [ ] Variables section showing visual variants
- [ ] Guidelines section (recommended)

#### Code Examples
- [ ] Uses `jsx-live` blocks (NOT `jsx-live-dev`)
- [ ] NO import statements in examples
- [ ] Examples are visually focused
- [ ] Examples show design variants clearly
- [ ] Proper formatting and indentation
- [ ] Realistic, production-ready examples

#### Design Focus
- [ ] Content is designer-focused (NOT implementation)
- [ ] Explains WHEN and WHY to use
- [ ] Visual hierarchy explained
- [ ] Color palette usage documented
- [ ] Size variants with design rationale
- [ ] Accessibility mentioned from user perspective

#### Writing Quality
- [ ] Clear, concise descriptions
- [ ] Design rationale provided
- [ ] Best practices documented
- [ ] Anti-patterns identified
- [ ] Consistent tone and voice
- [ ] No technical jargon without explanation

### Validation Report Format

```markdown
## Designer Documentation Validation: {ComponentName}

### Status: [✅ PASS | ❌ FAIL | ⚠️ WARNING]

### Files Reviewed
- Documentation file: `{component}.mdx`
- Guidelines: `docs/file-type-guidelines/documentation.md`

### ✅ Compliant
[List passing checks]

### ❌ Violations (MUST FIX)
- [Violation with guideline reference and line number]

### ⚠️ Warnings (SHOULD FIX)
- [Non-critical improvements]

### Design Focus Assessment
- Design rationale: [Present | Partial | Missing]
- Visual examples: [Comprehensive | Adequate | Insufficient]
- Guidelines quality: [Excellent | Good | Needs improvement]
- Writing guidelines: [Present | Not applicable | Missing]

### Recommendations
- [Specific improvements needed]
```

## Common Patterns

### Button-type Components

Focus on:
- Visual hierarchy (primary, secondary, tertiary)
- Action hierarchy and importance
- Color palette for different actions
- Icon placement and usage
- Writing guidelines for button labels

### Form Components

Focus on:
- Input states and validation
- Visual feedback for user actions
- Error state presentation
- Size variants for different contexts
- Label and placeholder guidance

### Feedback Components

Focus on:
- Visual hierarchy of importance
- Color semantics (info, success, warning, error)
- Icon usage for quick recognition
- When to use which feedback type
- Content guidelines for messages

### Overlay Components

Focus on:
- When to use vs alternatives
- Size and placement guidelines
- Content structure recommendations
- Dismissal patterns
- Accessibility from user perspective

## Error Recovery

If validation fails:

1. You MUST check frontmatter structure
2. You MUST verify unique ID format
3. You MUST ensure menu hierarchy is correct
4. You MUST confirm jsx-live blocks (not jsx-live-dev)
5. You SHOULD review tone (designer-focused, not technical)

## Reference Examples

You SHOULD reference these documentation files:

- **Simple**: `packages/nimbus/src/components/badge/badge.mdx`
- **Form**: `packages/nimbus/src/components/text-input/text-input.mdx`
- **Interactive**: `packages/nimbus/src/components/button/button.mdx`
- **Overlay**: `packages/nimbus/src/components/dialog/dialog.mdx`

## RFC 2119 Key Words

- **MUST** / **REQUIRED** / **SHALL** - Absolute requirement
- **MUST NOT** / **SHALL NOT** - Absolute prohibition
- **SHOULD** / **RECOMMENDED** - Should do unless valid reason not to
- **SHOULD NOT** / **NOT RECOMMENDED** - Should not do unless valid reason
- **MAY** / **OPTIONAL** - Truly optional

---

**Execute designer documentation operation for: $ARGUMENTS**
