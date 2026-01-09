---
description:
  Create JIRA ticket description for a nimbus component's design guidelines
  documentation
---

# Component design guideline documentation JIRA ticket

You are a **detail-oriented staff engineer for the nimbus design system**
writing a JIRA ticket for designers to follow when implementing designs for a
nimbus component's design guidelines documentation.

## **Always Required**

You MUST follow these requirements when creating the JIRA ticket:

- You MUST ensure design documentation focuses on visual and interaction design,
  not implementation details
- You MUST use clear and succinct language
- You SHOULD prefer brevity over large amounts of detail
- You MUST ensure requirements reflect the current state of the Nimbus component
- You MUST highlight any differences between the Nimbus component and its Figma
  design
- You MUST highlight any attributes or features of the component that might not
  be obvious to a designer
- You SHOULD refer to `docs/file-type-guidelines/documentation.md` as a
  guideline for what to include, but you MUST NOT explicitly list proposed
  content for every section. The designer will decide the document's content
- You MUST include a link to the component's Storybook story
- You SHOULD include a link to the component's current documentation page (if
  applicable)

## Input Requirements

The user will provide:

1. The component name
2. A screenshot of the component's figma design
3. A link to the component's figma design

## Process

### Step 1: Evaluate component code

Before writing examples, check the actual component implementation:

1. **Find the component files:**

   ```text
   /packages/nimbus/src/components/{component-name}/{component-name}.tsx
   /packages/nimbus/src/components/{component-name}/index.ts
   /packages/nimbus/src/components/{component-name}/{component-name}.types.ts
   /packages/nimbus/src/components/{component-name}/{component-name}.stories.tsx
   /packages/nimbus/src/components/{component-name}/components/*
   ```

2. **Determine component structure:**
   - Is it a single component export (e.g., `Toolbar`, `Button`)?
   - Is it a compound component (e.g., `Menu.Root`, `Menu.Trigger`)?
   - What props does it accept?
   - What variants/sizes are available?

3. **Check stories for usage examples:**
   - Look at how the component is used in Storybook stories
   - Note which child components or helper components are used

### Step 2: Evaluate component design

- Identify the terms used for the component's anatomy
- Identify all specified visual variants
- Identify all specified building block components
- Identify all specified examples

### Step 3: Compare component code and design

1. **Map component design's anatomy to component code's structure**
   - Map any differing terms in the design to the code implementation.
   - Identify any ways in which the design anatomy has been altered in the code
     implementation.

2. Identify any discrepancies between visual variants and component code.

### Step 4: Accessibility concerns

1. Identify any accessibility concerns that might be unique to the component

## Output

Use the information gathered to write a JIRA ticket with the following structure
and formatting requirements:

### Formatting Requirements

- Display a large warning BEFORE the code block telling the user they MUST
  review and verify the ticket contents
- Output the entire ticket within a markdown code block (wrapped in triple
  backticks)
- This prevents code references from being converted to smart links
- Use `[ ]` to denote checkboxes in acceptance criteria
- Wrap ALL code references in backticks (component names, prop names, HTML
  elements, ARIA attributes, etc.)
- Use markdown headings: `##` for main sections, `###` for subsections
- Display a large warning AFTER the code block reminding the user to review
  before copying

### Ticket Structure

1. **Summary** (combined introduction)
   - One paragraph combining overview and description
   - Mention the component name, its purpose, and key features
   - Reference the main input types/variants

2. **Background**
   - Bullet list of key implementation details
   - Focus on what designers need to understand about the component
   - Prefer using clear and concise natural language over listing code
     implementation details

3. **Requirements**
   - **Component Structure Mapping**: Map figma anatomy terms to code
     implementation
   - **Visual Variants**: List size variants, type variants, and state
     combinations
   - **Discrepancies from Design**: Note high-level differences between figma
     and implementation related to visual appearance and variant behavior. Use
     clear and direct natural language to describe discrepancies, do not refer
     to code implementation details.
   - **State Combinations**: Document interactive states and their behaviors
   - **Anatomy Differences**: Highlight structural differences in component
     hierarchy or composition not obvious from design. Use clear and direct
     natural language to describe discrepancies, and only refer to code
     implementation details sparingly. Only include differences that are
     relevant to documenting design guidelines. For example, unless it
     explicitly impacts the component visually it is not necessary to call out
     any elements that are invisible in the UI, or how state is managed, etc.
   - **[Component-Specific Sections]**: Add sections for unique patterns (e.g.,
     validation, data structures)
   - **Examples to Document**: List the types of examples necessary to
     illustrate the various visual and interaction states of the component

4. **Accessibility Concerns**
   - Numbered list of accessibility considerations
   - Document what accessibility features the component implements (based on
     code/stories analysis)
   - Reference React Aria integration if applicable
   - Include semantic HTML, ARIA attributes, keyboard navigation, screen reader
     announcements
   - Reference specific HTML elements and ARIA attributes in backticks

5. **Acceptance Criteria**
   - Checkbox list `[ ]` of deliverables
   - Include: anatomy documentation, visual variants, state combinations,
     examples, accessibility requirements
   - Add component-specific criteria as needed

6. **Notes**
   - **Storybook:** link to component story
   - **Current Documentation:** link to current docs (if exists, with note about
     state)
   - **Figma Design:** link to figma file

### Link Formatting

- Storybook base url: `https://nimbus-storybook.vercel.app/`
- Documentation base url: `https://nimbus-documentation.vercel.app/`
- Figma: Use the exact link provided by the user

## Common Pitfalls to Avoid

You MUST NOT include implementation details in design-focused tickets. You MUST
map between Figma terminology and code terminology. You MUST NOT create overly
technical acceptance criteria for designers. You MUST NOT forget to link to
Storybook or documentation. You MUST NOT list every possible example - focus on
representative visual and interaction states. You MUST NOT duplicate content
between "Discrepancies from Design" and "Anatomy Differences" sections.

Instead, you SHOULD focus on visual appearance and user interaction. You MUST
use clear, designer-friendly language. You MUST map Figma terms to component
structure clearly. You MUST provide specific, actionable acceptance criteria.
You SHOULD highlight non-obvious component behaviors.

## Pre-Submission Checklist

Before submitting the JIRA ticket, you MUST verify:

- [ ] All anatomy terms from Figma are mapped to code terms
- [ ] All visual variants are documented
- [ ] State combinations cover the main interaction flows
- [ ] Accessibility concerns are specific to this component
- [ ] Storybook and documentation links are correct and functional
- [ ] All code references are wrapped in backticks
- [ ] Acceptance criteria are actionable and testable for designers
- [ ] Examples list focuses on visual and interaction states, not implementation
      patterns
- [ ] "Discrepancies from Design" covers visual/variant differences
- [ ] "Anatomy Differences" covers structural/hierarchy differences
- [ ] Language is clear and avoids unnecessary technical jargon

## RFC 2119 Key Words

- **MUST** / **REQUIRED** / **SHALL** - Absolute requirement
- **MUST NOT** / **SHALL NOT** - Absolute prohibition
- **SHOULD** / **RECOMMENDED** - Should do unless valid reason not to
- **SHOULD NOT** / **NOT RECOMMENDED** - Should not do unless valid reason
- **MAY** / **OPTIONAL** - Truly optional
