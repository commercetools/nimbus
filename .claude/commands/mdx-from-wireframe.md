---
description:
  Create or update component MDX documentation from wireframe images and text
---

# MDX from Wireframe

You are tasked with creating or updating component MDX documentation files from
wireframe images and raw text content. ultrathink, I know you can do this.

## Input Requirements

The user will provide:

1. A wireframe image showing the component documentation design
2. Raw text extracted from the wireframe
3. The component name (or you can infer it from context)

## Process

### Step 1: Analyze Existing Documentation

Read **at least 2-3** existing finalized component MDX files to understand:

- Content structure and organization
- Frontmatter patterns
- Code example patterns (jsx live blocks)
- Tone and style
- Section naming conventions

**Reference components with finalized docs:**

- `/packages/nimbus/src/components/alert/alert.mdx`
- `/packages/nimbus/src/components/checkbox/checkbox.mdx`
- `/packages/nimbus/src/components/text/text.mdx`
- `/packages/nimbus/src/components/avatar/avatar.mdx`
- `/packages/nimbus/src/components/form-field/form-field.mdx`

**Reference documentation:**

- `/docs/file-type-guidelines/documentation.md`

### Step 2: Verify Component API

Before writing examples, check the actual component implementation:

1. **Find the component files:**

   ```
   /packages/nimbus/src/components/{component-name}/{component-name}.tsx
   /packages/nimbus/src/components/{component-name}/index.ts
   /packages/nimbus/src/components/{component-name}/{component-name}.types.ts
   /packages/nimbus/src/components/{component-name}/{component-name}.stories.tsx
   ```

2. **Determine component structure:**
   - Is it a single component export (e.g., `Toolbar`, `Button`)?
   - Is it a compound component (e.g., `Menu.Root`, `Menu.Trigger`)?
   - What props does it accept?
   - What variants/sizes are available?

3. **Check stories for usage examples:**
   - Look at how the component is used in Storybook stories
   - Note which child components or helper components are used
   - Identify which Nimbus icons are commonly used

### Step 3: Create MDX File

**Location:**
`/packages/nimbus/src/components/{component-name}/{component-name}.mdx`

**Required frontmatter fields:**

```yaml
---
id: Components-ComponentName
title: Component Name
description: Brief one-line description
documentState: InitialDraft
order: 999
menu:
  - Components
  - Category Name # Data Display, Navigation, Inputs, Feedback, etc.
  - Component Name
tags:
  - component
  - relevant-keywords
figmaLink: >-
  https://www.figma.com/design/...
---
```

### Step 4: Follow Content Structure

Based on analyzed examples, use this structure:

The component title and description are rendered from frontmatter. Do not add a
`# Component Name` heading or introductory paragraph in the body. Content starts
directly with the first `##` section.

```markdown
## Overview

Detailed explanation of purpose and behavior.

### Resources

Deep dive into implementation details and access the Nimbus design library.

[Figma library](figmaLink) [React Aria Docs](reactAriaLink) # If applicable

## Variables

Get familiar with the features.

### Feature Category 1

#### Variant Name

Description of the variant.

\`\`\`jsx live const App = () => ( <ComponentName>Example</ComponentName> )
\`\`\`

### Feature Category 2

[Continue with more examples...]

## Guidelines

Component usage guidelines.

### Best practices

- **Practice 1:** Description
- **Practice 2:** Description

### Usage

Description of when to use.

> [!TIP]\
> When to use
>
> - Use case 1
> - Use case 2

> [!CAUTION]\
> When not to use
>
> - Avoid case 1
> - Avoid case 2

### Specific Guideline Topics

> [!TIP]\
> **Do**
>
> - Do this thing
> - Do that thing

![Do](/images/component-name/component-name-do.png)

> [!CAUTION]\
> **Don't**
>
> - Don't do this
> - Don't do that

![Don't](/images/component-name/component-name-dont.png)

## Specs

<PropsTable id="ComponentName" />

## Accessibility

Accessibility ensures that digital content and functionality are usable by
everyone.

### Accessibility standards

- **Keyboard Navigation:** Description
- **ARIA Roles:** Description
- **Labeling:** Description
- **Provide clear status:**
  - Sub-item 1
  - Sub-item 2
```

### Step 5: Code Example Requirements

**CRITICAL RULES:**

1. **ALL examples MUST use `jsx live` blocks:**

   ```markdown
   \`\`\`jsx live const App = () => ( <ComponentName>Content</ComponentName> )
   \`\`\`
   ```

2. **NO Storybook imports or syntax** - jsx live has components available
   globally

3. **Available components (no imports needed):**
   - All Nimbus components (Button, Stack, Text, Box, Grid, etc.)
   - All Nimbus icons via `Icons.IconName`
   - React hooks (useState, useEffect, etc.)

4. **Use actual component API** verified in Step 2

5. **Match icon usage from wireframes** - check similar components like
   rich-text-input for icon names

### Step 6: Reconcile with Existing Content

If updating an existing MDX file:

1. **PRESERVE NOTHING** from AI-generated placeholder text
2. **USE the new content entirely** from the wireframe
3. **MAINTAIN consistency** with other finalized docs
4. **ENSURE completeness** - don't leave placeholder sections

### Step 7: Validate Against Guidelines

Before considering the task complete:

1. **Check MDX guidelines:** Review
   `/docs/file-type-guidelines/documentation.md`
2. **Verify frontmatter:** All required fields present
3. **Validate code examples:** All use jsx live, no Storybook syntax
4. **Confirm structure:** Matches established patterns
5. **Test completeness:** No TODO comments or placeholder text

## Common Pitfalls to Avoid

- ❌ Using compound component syntax when component is single export
- ❌ Using Storybook imports or Canvas components in MDX
- ❌ Forgetting to wrap interactive icons in IconButton components
- ❌ Using non-existent component props or variants
- ❌ Copying placeholder text instead of using wireframe content
- ❌ Missing required frontmatter fields
- ❌ Inconsistent section naming or structure

## Output

After completing the MDX file:

1. **Summarize the structure** created
2. **Note any assumptions** made about the component API
3. **Highlight any issues** discovered (e.g., API mismatches, missing icons)
4. **Suggest improvements** if applicable (e.g., separator visibility, prop
   corrections)

## Notes

- **Be proactive** - if you see component API issues during implementation, fix
  them immediately
- **Be accurate** - always verify component exports and APIs before writing
  examples
- **Be consistent** - follow established patterns from finalized docs
- **Be complete** - ensure all wireframe content is incorporated
