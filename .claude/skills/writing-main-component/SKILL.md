---
description: Create, update, or validate main component implementation files
argument-hint: create|update|validate ComponentName [details]
---

# Writing Main Component Skill

You are a Nimbus component implementation specialist. This skill helps you
create, update, or validate main component files (`{component}.tsx`) that serve
as either the implementation home for single components or the export facade for
compound components.

## Critical Requirements

**Main component files define the public API contract.** Every component MUST
follow strict patterns for ref forwarding, props management, React Aria
integration, and accessibility compliance (WCAG 2.1 AA).

Key patterns enforced:

- Ref forwarding using `mergeRefs` + `useObjectRef`
- Props management: splitting, extracting, and forwarding in correct order
- React Aria integration with `Ra` prefix imports
- JSDoc documentation with `@see` links and examples
- Architecture-aware validation (single vs compound patterns)

---

## Mode Detection

Parse the request to determine the operation:

- **create** - Generate new main component file (typically invoked by
  `/propose-component`)
- **update** - Enhance existing component (new props, i18n, accessibility
  improvements)
- **validate** - Check component compliance with guidelines (**PRIMARY USE
  CASE**)

If no mode is specified, default to **validate**.

**Note**: Creation is typically handled by the `/propose-component` workflow.
Direct creation should only be used for standalone needs or prototyping.

---

## Required Research (All Modes)

Before any operation, you MUST research in parallel:

1. **Read** main component guidelines:
   - File: `docs/file-type-guidelines/main-component.md`
   - Purpose: Core validation rules for main components

2. **Read** architecture decision guide:
   - File: `docs/file-type-guidelines/architecture-decisions.md`
   - Purpose: Understanding when to use single vs compound patterns

3. **Read** compound component patterns:
   - File: `docs/file-type-guidelines/compound-components.md`
   - Purpose: Compound component structure and requirements

4. **Read** JSDoc standards:
   - File: `docs/jsdoc-standards.md`
   - Purpose: Documentation requirements and format

5. **Read** naming conventions:
   - File: `docs/naming-conventions.md`
   - Purpose: File naming, component naming, and import patterns

6. **Analyze** component type (single vs compound):
   - Single: Implementation in main file
   - Compound: Exports only, implementation in `components/` subfolder

7. **Review** related component files:
   - Types file:
     `packages/nimbus/src/components/{component}/{component}.types.ts`
   - Slots file:
     `packages/nimbus/src/components/{component}/{component}.slots.tsx` (if
     exists)
   - Recipe file:
     `packages/nimbus/src/components/{component}/{component}.recipe.ts` (if
     exists)
   - i18n file: `packages/nimbus/src/components/{component}/{component}.i18n.ts`
     (if exists)

8. **Study** similar component patterns:
   - Simple single: `packages/nimbus/src/components/button/button.tsx`
   - Complex single:
     `packages/nimbus/src/components/split-button/split-button.tsx`
   - Simple compound: `packages/nimbus/src/components/tooltip/tooltip.tsx`
   - Complex compound: `packages/nimbus/src/components/drawer/drawer.tsx`

---

## File Structure

### Location

```
packages/nimbus/src/components/{component-name}/{component-name}.tsx
```

### Component Architecture Patterns

**Single Component Pattern:**

- Implementation code lives directly in main file
- Uses React Aria hooks OR components
- Forwards refs using `mergeRefs` + `useObjectRef`
- Wraps with slot components for styling
- Example: Button, Checkbox, Badge

**Compound Component Pattern:**

- Main file contains EXPORTS ONLY (NO implementation code)
- Imports sub-components from `./components/index.ts` barrel export
- Each part documented with JSDoc in main file
- `.Root` component MUST be first property (non-negotiable)
- Example: Drawer, Menu, Tabs

### Architecture Decision Matrix

Use this matrix to determine component type:

| Characteristic                                    | Pattern          | Example                 |
| ------------------------------------------------- | ---------------- | ----------------------- |
| Single interactive element                        | Simple Single    | Button, Checkbox, Badge |
| Single element with complex composition           | Complex Single   | SplitButton             |
| Multiple coordinated parts (no state sharing)     | Simple Compound  | Tooltip, Card           |
| Multiple coordinated parts (shared state/context) | Complex Compound | Drawer, Menu, Tabs      |

**Key Questions:**

1. Does component have multiple related parts? → Compound
2. Do parts need to coordinate/share state? → Complex Compound
3. Is it a single interactive element? → Single
4. Does it compose other components? → Complex Single

---

## Validate Mode

### Validation Checklist

Run every item in `reference/validation-checklist.md` (64 items across 10 categories). Record each violation with its file and line number. Write the report in the format given in `reference/validation-report.md`.

---

## Create Mode

### Important Note

Component creation is typically handled by the `/propose-component` workflow,
which orchestrates:

1. Brainstorming and requirements gathering (`/brainstorm`)
2. Architecture decision making
3. File generation (types, component, slots, recipes, stories, i18n)
4. Validation and compliance checking

**Direct creation with this skill should only be used for:**

- Standalone component creation without full workflow
- Prototyping and experimentation
- Educational purposes

### Creation Process

If creating directly:

#### Step 1: Determine Architecture

Use the Architecture Decision Matrix above to determine:

- Single vs Compound
- Simple vs Complex
- React Aria integration approach
- Slot requirements

#### Step 2: Create Required Files First

Before creating the main component, ensure these files exist:

```bash
# 1. Create types file
/writing-types create ComponentName

# 2. Create slots file (if component has styling)
/writing-slots create ComponentName

# 3. Create recipe file (if component has variants)
/writing-recipes create ComponentName

# 4. Create i18n file (if component has user-facing text)
/writing-i18n create ComponentName
```

#### Step 3: Generate Component Implementation

**Template for Simple Single Components:**

````typescript
import { useRef } from 'react';
import { useObjectRef, mergeProps } from 'react-aria';
import { mergeRefs } from '@/utils';
import { Button as RaButton } from 'react-aria-components';
import { ComponentRoot } from './component.slots';
import type { ComponentProps } from './component.types';

/**
 * ComponentName
 * ============================================================
 * [Brief description of what the component does and its primary purpose.]
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/category/component-name}
 *
 * @example
 * ```tsx
 * <ComponentName variant="primary" size="md">
 *   Content
 * </ComponentName>
 * ```
 *
 * @supportsStyleProps
 */
export const ComponentName = (props: ComponentProps) => {
  const { ref: forwardedRef, children, ...rest } = props;

  // Create local ref for internal use
  const localRef = useRef<HTMLButtonElement>(null);

  // Merge with forwarded ref
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  return (
    <ComponentRoot asChild>
      <RaButton {...rest} ref={ref}>
        {children}
      </RaButton>
    </ComponentRoot>
  );
};

ComponentName.displayName = 'ComponentName';
````

**Template for Compound Components:**

````typescript
import { ComponentRoot } from "./components/component.root";
import { ComponentTrigger } from "./components/component.trigger";
import { ComponentContent } from "./components/component.content";

/**
 * ComponentName
 * ============================================================
 * [Brief description of what the component does and how parts work together.]
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/category/component-name}
 *
 * @example
 * ```tsx
 * <ComponentName.Root>
 *   <ComponentName.Trigger>Open</ComponentName.Trigger>
 *   <ComponentName.Content>
 *     Content here
 *   </ComponentName.Content>
 * </ComponentName.Root>
 * ```
 */
export const ComponentName = {
  /**
   * # ComponentName.Root
   *
   * The root component that provides context and state management for all parts.
   * Must wrap all component parts to coordinate their behavior.
   *
   * @example
   * ```tsx
   * <ComponentName.Root defaultOpen={false}>
   *   <ComponentName.Trigger>Open</ComponentName.Trigger>
   *   <ComponentName.Content>Content</ComponentName.Content>
   * </ComponentName.Root>
   * ```
   */
  Root: ComponentRoot,

  /**
   * # ComponentName.Trigger
   *
   * [Description of what the trigger does and when it's used.]
   * [Any important behavioral notes.]
   *
   * @example
   * ```tsx
   * <ComponentName.Trigger>
   *   Click me
   * </ComponentName.Trigger>
   * ```
   */
  Trigger: ComponentTrigger,

  /**
   * # ComponentName.Content
   *
   * [Description of what the content displays and how it's controlled.]
   * [Any layout or sizing notes.]
   *
   * @example
   * ```tsx
   * <ComponentName.Content>
   *   <p>Content goes here</p>
   * </ComponentName.Content>
   * ```
   */
  Content: ComponentContent,
};
````

The namespace object is the only export. Each sub-component's prop table is
generated from its own implementation file, keyed on its authored `displayName`
(`ComponentRoot.displayName = 'ComponentName.Root'`) — see
[Compound Components Guidelines — JSDoc Tags in Implementation Files](../../../docs/file-type-guidelines/compound-components.md#jsdoc-tags-in-implementation-files-critical).

#### Step 4: Verify Creation

After creating the component:

```bash
# 1. Type check against source (no build required; matches the editor)
pnpm --filter @commercetools/nimbus typecheck:dev

# 2. Build
pnpm --filter @commercetools/nimbus build

# 3. Validate
/writing-main-component validate ComponentName
```

---

## Update Mode

### Update Process

When updating an existing main component:

1. **Read current state**:
   - Read main component file
   - Read related files (types, slots, recipe, i18n)
   - Identify architecture pattern (single vs compound)

2. **Preserve conventions**:
   - Maintain existing structure
   - Keep ref forwarding patterns
   - Preserve prop management approach
   - Maintain import organization

3. **Update systematically**:
   - Update types first (if props change)
   - Update implementation
   - Update JSDoc if capabilities change
   - Update tests/stories

4. **Verify changes**:
   - Type check (source, no build): `pnpm --filter @commercetools/nimbus typecheck:dev`
   - Build: `pnpm --filter @commercetools/nimbus build`
   - Validate: `/writing-main-component validate ComponentName`

### Common Update Scenarios

Find the scenario that matches the request, then read only that section of `reference/update-scenarios.md`:

- Scenario 1: Adding New Props
- Scenario 2: Adding i18n Support
- Scenario 3: Adding React Aria Integration
- Scenario 4: Converting Single to Compound

### Post-Update Verification

After any update, you MUST verify:

```bash
# 1. Type check against source (no build required; matches the editor)
pnpm --filter @commercetools/nimbus typecheck:dev

# 2. Run tests against source (no build required)
pnpm test:dev packages/nimbus/src/components/{component}/{component}.stories.tsx

# 3. Validate compliance
/writing-main-component validate {ComponentName}
```

---

## Error Recovery

If validation fails or you encounter errors, systematically check these common
issues:

Find the matching error below, then read only its section in `reference/error-recovery.md`:

- Error 1: Ref Forwarding Issues
- Error 2: Props Spreading Order
- Error 3: React Aria Import Conflicts
- Error 4: Cross-Component Import Cycles
- Error 5: Missing DisplayName
- Error 6: Missing @see Link
- Error 7: Compound Component Root Not First
- Error 8: Style Props Not Working

---

## Decision Flows

Use the flows in `reference/decision-flows.md` to choose patterns for your component:

- Flow 1: Component Architecture Decision
- Flow 2: Ref Forwarding Pattern Decision
- Flow 3: React Aria Integration Decision
- Flow 4: Import Strategy Decision

---

## Reference Examples

Study these component files for implementation patterns. They are organized by
complexity tier.

### Tier 1: Simple Single Components

#### Button - Classic Single Component Pattern

- **File**: `packages/nimbus/src/components/button/button.tsx`
- **Pattern**: React Aria hook (useButton) + slot wrapper
- **Ref**: mergeRefs + useObjectRef pattern
- **Context**: useContextProps for Button.Context
- **Key Features**:
  - Standard ref forwarding with merged refs
  - React Aria `useButton` hook integration
  - Context props consumption
  - Simple prop spreading to slot

**Use Button for**:

- Basic ref forwarding examples
- React Aria hook integration
- Context props patterns
- Standard single component structure

---

#### Checkbox - Simple Form Component

- **File**: `packages/nimbus/src/components/checkbox/checkbox.tsx`
- **Pattern**: React Aria component wrapper with render function
- **Ref**: Standard forwarding (no local ref needed)
- **Recipe**: Slot recipe with multiple parts (root, label, indicator)
- **Key Features**:
  - React Aria `Checkbox` component wrapping
  - Render function for state access
  - Slot recipe integration
  - Data attributes for styling

**Use Checkbox for**:

- React Aria component wrapping
- Render function patterns
- Slot recipe with multiple parts
- Form component patterns

---

### Tier 2: Complex Single Components

#### SplitButton - Composition Pattern

- **File**: `packages/nimbus/src/components/split-button/split-button.tsx`
- **Pattern**: Composes Button + Menu with child processing
- **Ref**: Multiple ref handling for composed components
- **i18n**: Internationalized aria-labels
- **Key Features**:
  - Child processing with React.Children
  - Composing multiple Nimbus components
  - Complex prop management
  - i18n integration for accessibility

**Use SplitButton for**:

- Child processing examples
- Composition of multiple components
- Complex single component patterns
- i18n integration examples

---

### Tier 3: Simple Compound Components

#### Tooltip - Minimal Compound

- **File**: `packages/nimbus/src/components/tooltip/tooltip.tsx`
- **Pattern**: Minimal compound (Root + Content)
- **Implementation**: Direct React Aria component wrappers
- **Parts**: Root (TooltipTrigger), Content (Tooltip)
- **Key Features**:
  - Minimal compound structure (2 parts)
  - Direct React Aria component wrapping
  - No context management needed
  - Simple prop forwarding

**Use Tooltip for**:

- Simple compound structure
- Direct React Aria wrappers
- Minimal part coordination
- Compound without context

---

#### Card - Layout-Only Compound

- **File**: `packages/nimbus/src/components/card/card.tsx`
- **Pattern**: Layout-only compound (no React Aria)
- **Implementation**: Styled slots only
- **Parts**: Root, Header, Body, Footer
- **Key Features**:
  - No React Aria integration
  - Slot-only styling
  - Layout composition
  - Simple part structure

**Use Card for**:

- Layout compounds without interaction
- Slot-only implementations
- Simple composition without state
- Styling-focused components

---

### Tier 4: Complex Compound Components

#### Drawer - Full-Featured Overlay

- **File**: `packages/nimbus/src/components/drawer/drawer.tsx`
- **Pattern**: Complex compound with context management
- **Parts**: Root, Trigger, Content, Header, Body, Footer, Title, CloseTrigger
  (8 parts)
- **Implementation**: Context + React Aria Dialog
- **Key Features**:
  - Context for state sharing across parts
  - Conditional React Aria wrapper based on children
  - Multiple parts with specific responsibilities
  - Focus management and overlay patterns

**Use Drawer for**:

- Complex compound structure
- Context management examples
- Overlay patterns
- Multi-part coordination
- Conditional React Aria usage

---

#### Menu - Selection Compound

- **File**: `packages/nimbus/src/components/menu/menu.tsx`
- **Pattern**: Complex compound with state management
- **Parts**: Root, Trigger, Content, Item, Section (5 parts)
- **Implementation**: React Aria Menu + custom context
- **Key Features**:
  - Selection state management
  - Keyboard navigation (arrow keys)
  - Slot recipe for styling variants
  - Context for trigger coordination

**Use Menu for**:

- Selection patterns
- Keyboard navigation examples
- Complex state management
- React Aria Menu integration

---

#### Tabs - Navigation Compound

- **File**: `packages/nimbus/src/components/tabs/tabs.tsx`
- **Pattern**: Complex compound with keyboard navigation
- **Parts**: Root, List, Tab, Panels, Panel (5 parts)
- **Implementation**: React Aria Tabs + state coordination
- **Key Features**:
  - Tab selection state
  - Keyboard navigation (arrow keys)
  - Panel coordination with tabs
  - ARIA relationships

**Use Tabs for**:

- Multi-panel navigation
- Keyboard navigation patterns
- Tab-panel coordination
- ARIA relationship examples

---

### Pattern Reference Matrix

Use this matrix to find the right example component for specific patterns:

| Pattern Need               | Example Component | Key Feature                              | File Path                                                      |
| -------------------------- | ----------------- | ---------------------------------------- | -------------------------------------------------------------- |
| **Ref Forwarding**         | Button            | mergeRefs + useObjectRef                 | `packages/nimbus/src/components/button/button.tsx`             |
| **React Aria Hook**        | Button            | useButton integration                    | `packages/nimbus/src/components/button/button.tsx`             |
| **React Aria Component**   | Checkbox          | Component wrapper                        | `packages/nimbus/src/components/checkbox/checkbox.tsx`         |
| **Render Function**        | Checkbox          | State-based rendering                    | `packages/nimbus/src/components/checkbox/checkbox.tsx`         |
| **Child Processing**       | SplitButton       | React.Children.forEach                   | `packages/nimbus/src/components/split-button/split-button.tsx` |
| **Composition**            | SplitButton       | Multiple component composition           | `packages/nimbus/src/components/split-button/split-button.tsx` |
| **i18n Integration**       | SplitButton       | useLocalizedStringFormatter + msg.format | `packages/nimbus/src/components/split-button/split-button.tsx` |
| **Simple Compound**        | Tooltip           | Minimal compound structure               | `packages/nimbus/src/components/tooltip/tooltip.tsx`           |
| **Layout Compound**        | Card              | Slot-only composition                    | `packages/nimbus/src/components/card/card.tsx`                 |
| **Context Management**     | Drawer            | Context + state sharing                  | `packages/nimbus/src/components/drawer/drawer.tsx`             |
| **Overlay Pattern**        | Drawer            | Focus trap + restoration                 | `packages/nimbus/src/components/drawer/drawer.tsx`             |
| **Conditional React Aria** | Drawer            | Child-based wrapper logic                | `packages/nimbus/src/components/drawer/drawer.tsx`             |
| **Selection State**        | Menu              | Selection management                     | `packages/nimbus/src/components/menu/menu.tsx`                 |
| **Keyboard Navigation**    | Menu, Tabs        | Arrow key handling                       | `packages/nimbus/src/components/menu/menu.tsx`                 |
| **Multi-Panel**            | Tabs              | Panel coordination                       | `packages/nimbus/src/components/tabs/tabs.tsx`                 |
| **Slot Recipe**            | Checkbox, Menu    | Multi-slot styling                       | `packages/nimbus/src/components/checkbox/checkbox.tsx`         |
| **Style Props Support**    | Button            | extractStyleProps                        | `packages/nimbus/src/components/button/button.tsx`             |

---

## RFC 2119 Key Words

For clarity in these guidelines, key words have specific meanings per
[RFC 2119](https://www.ietf.org/rfc/rfc2119.txt):

### Requirement Levels

**MUST / REQUIRED / SHALL**

- Indicates an absolute requirement
- Validation FAILS if not followed
- Example: "Component MUST forward refs using mergeRefs pattern"
- Impact: ❌ Blocking issue

**MUST NOT / SHALL NOT**

- Indicates an absolute prohibition
- Validation FAILS if violated
- Example: "Component MUST NOT use barrel exports for cross-component imports"
- Impact: ❌ Blocking issue

**SHOULD / RECOMMENDED**

- Indicates recommended practice
- Valid reasons may exist not to follow
- Validation shows ⚠️ WARNING if not followed
- Example: "DisplayName SHOULD match component name"
- Impact: ⚠️ Warning (should fix)

**SHOULD NOT / NOT RECOMMENDED**

- Indicates practice should be avoided
- Valid reasons may exist to do it anyway
- Validation shows ⚠️ WARNING if violated
- Example: "Components SHOULD NOT use inline styles"
- Impact: ⚠️ Warning (should fix)

**MAY / OPTIONAL**

- Indicates truly optional choice
- No validation impact
- Example: "Component MAY use context for state management"
- Impact: No validation impact

### Examples in Context

**MUST Examples:**

- "Component MUST forward refs" → Validation fails if missing
- "Compound Root MUST be first property" → Validation fails if violated
- "JSDoc MUST include @see link" → Validation fails if missing

**SHOULD Examples:**

- "DisplayName SHOULD match file name" → Warning if incorrect
- "Props SHOULD be destructured at entry" → Warning if not followed
- "i18n messages SHOULD be extracted to separate file" → Warning if inline

**MAY Examples:**

- "Component MAY use context for state" → Optional, no validation
- "Component MAY implement custom focus management" → Optional choice
- "Slots MAY be organized in subdirectories" → Optional organization

### Validation Impact

| Keyword    | Validation Impact | Fix Priority    |
| ---------- | ----------------- | --------------- |
| MUST       | ❌ FAIL           | P0 - Must fix   |
| MUST NOT   | ❌ FAIL           | P0 - Must fix   |
| SHOULD     | ⚠️ WARNING        | P1 - Should fix |
| SHOULD NOT | ⚠️ WARNING        | P1 - Should fix |
| MAY        | ✅ No impact      | P2 - Optional   |

---

**Execute main component operation for component specified in arguments**
