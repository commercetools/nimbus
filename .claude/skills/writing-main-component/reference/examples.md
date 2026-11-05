# Reference Examples

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
