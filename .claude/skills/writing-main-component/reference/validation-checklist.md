# Main Component Validation Checklist

### Validation Checklist

You MUST validate main component files against these requirements organized by
category. Each violation MUST be reported with specific line numbers and
guideline references.

#### Category 1: File Structure & Architecture (7 items)

- [ ] **File location**: Component file exists at correct location:
      `packages/nimbus/src/components/{component}/{component}.tsx`
- [ ] **Imports**: File imports only required dependencies (no unused imports)
- [ ] **Compound exports**: For compound components, main file contains EXPORTS
      ONLY (NO implementation logic)
- [ ] **Compound imports**: For compound components, imports from barrel export
      `./components/index.ts`, NOT individual files
- [ ] **Single implementation**: For single components, implementation is
      present in main file
- [ ] **DisplayName (load-bearing for docs)**: Component has `displayName` set
      correctly:
  - Single: `Component.displayName = "ComponentName"`
  - Compound part: `ComponentPart.displayName = "Component.Part"` (e.g.
    `MenuTrigger.displayName = 'Menu.Trigger'`)
  - This is not just a React DevTools convenience — for compound parts, the
    docs pipeline parses the implementation file directly and keys the
    generated prop table on this exact `displayName` string. Get it wrong, or
    omit it, and that part's prop table will not generate.
- [ ] **No utility exports**: Main component file MUST NOT export pure helper
      functions (non-React, non-component values). Pure functions live in
      `utils/{kebab-name}.ts` with a sibling `{kebab-name}.spec.ts` and an
      `utils/index.ts` barrel — see
      `docs/file-type-guidelines/utils-and-constants.md` and existing patterns
      in `combobox/utils/`, `inline-svg/utils/`, `money-input/utils/`.
      Detection: any `export function name(...)` or
      `export const name = (...) => ...` where the return value is not JSX is a
      utility, not a component.

#### Category 2: Component Type & Pattern (7 items)

- [ ] **Architecture decision**: Component type (single vs compound) matches
      requirements
- [ ] **Pattern selection**: Pattern choice (simple/complex, single/compound) is
      appropriate
- [ ] **Compound Root first**: For compound components, `.Root` is FIRST
      property in export object (API contract requirement)
- [ ] **Compound JSDoc**: For compound components, each part has JSDoc in main
      export file
- [ ] **Part JSDoc format**: Each compound part's JSDoc includes:
  - Heading: `# Component.Part`
  - Description: 1-3 sentences explaining purpose
  - Example: `@example` block with typical usage
- [ ] **Single pattern**: For single components, uses appropriate React Aria
      pattern (hook, component, or composition)
- [ ] **Type exports**: Component types properly exported (re-export from types
      file or inline)

#### Category 3: Ref Forwarding (6 items)

- [ ] **Ref prop acceptance**: Component accepts `ref` prop in props interface
- [ ] **Local ref creation**: Local ref created with `useRef<HTMLElement>(null)`
      when needed for hooks
- [ ] **Ref merging**: Refs merged correctly:
      `const ref = useObjectRef(mergeRefs(localRef, forwardedRef))`
- [ ] **Ref forwarding**: Merged ref forwarded to underlying element (React Aria
      component or slot)
- [ ] **Ref types**: Ref type matches underlying element type
      (`HTMLButtonElement`, `HTMLDivElement`, etc.)
- [ ] **Compound ref**: For compound Root components, ref forwarding implemented
      if needed

#### Category 4: Props Management (8 items)

- [ ] **Props destructuring**: Props destructured appropriately at component
      entry
- [ ] **Props extraction**: Props extracted in standard pattern:
      `const { ref: forwardedRef, children, ...rest } = props`
- [ ] **Recipe splitting**: If using slot recipes, variants split correctly:
      `const [recipeProps, restRecipeProps] = recipe.splitVariantProps(props)`
- [ ] **Style props extraction**: If supporting style props, extracted
      correctly:
      `const [styleProps, functionalProps] = extractStyleProps(restProps)`
- [ ] **Props forwarding order**: Props forwarded in correct order:
  1. Recipe props (variants, sizes)
  2. Style props (margin, padding, etc.)
  3. Functional props (event handlers, aria attributes)
- [ ] **Props merging**: No prop spreading conflicts; use `mergeProps` when
      combining multiple prop sources
- [ ] **Context props**: If using React Aria contexts, props consumed via
      `useContextProps(props, ref, Context)`
- [ ] **DOM prop filtering**: Component-specific handlers (e.g.,
      `onValueChange`, `onTextChange`) are component abstractions, not DOM
      events. Destructure them before spreading props to DOM elements

#### Category 5: React Aria Integration (8 items)

- [ ] **Ra prefix imports**: React Aria imports use `Ra` prefix consistently, except `useObjectRef` (see `docs/naming-conventions.md`):
  - `import { Button as RaButton } from 'react-aria-components'`
  - `import type { ButtonProps as RaButtonProps } from 'react-aria-components'`
- [ ] **Hook integration**: For hook-based components, props passed to React
      Aria hooks and return values forwarded
- [ ] **Component wrapping**: For component-based, React Aria components wrapped
      with slots using `asChild` pattern
- [ ] **Context integration**: Uses `useContextProps` for context-aware behavior
      when applicable
- [ ] **Event handlers**: Uses `onPress` (not `onClick`) for React Aria
      button-like components
- [ ] **Keyboard navigation**: Delegates keyboard navigation to React Aria (no
      custom keyboard handlers unless necessary)
- [ ] **Focus management**: Uses React Aria's built-in focus handling
- [ ] **State management**: Uses React Aria hooks for complex state
      (useToggleState, useSelectState, etc.) when applicable

#### Category 6: Accessibility (WCAG 2.1 AA) (9 items)

- [ ] **Semantic HTML**: Uses semantic HTML elements (button, nav, main) OR
      proper ARIA roles
- [ ] **Keyboard accessibility**: All interactive elements keyboard accessible
      (handled by React Aria)
- [ ] **Focus indicators**: Focus indicators visible (applied via recipe/slots)
- [ ] **ARIA attributes**: ARIA attributes set correctly: `aria-label`,
      `aria-describedby`, `aria-disabled`, etc.
- [ ] **Data attributes**: State-based data attributes: `data-disabled`,
      `data-invalid`, `data-selected` (as needed)
- [ ] **Icon labels**: Icon-only elements have `aria-label` using
      `msg.format("*")` for i18n
- [ ] **Color not sole indicator**: Color not sole indicator of state (icons +
      text + aria attributes used)
- [ ] **Overlay focus management**: For overlays, focus management (trap,
      restoration) handled by React Aria
- [ ] **Form associations**: For form elements, labels associated with inputs,
      error messages announced

#### Category 7: JSDoc Documentation (8 items)

- [ ] **Main component JSDoc**: Main export has JSDoc block with heading
      separator:
  ```typescript
  /**
   * ComponentName
   * ============================================================
   * Brief description
   */
  ```
- [ ] **Description**: JSDoc includes 1-2 sentence description explaining
      component purpose
- [ ] **@see link**: JSDoc includes `@see` link to live documentation:
  - Format:
    `@see {@link https://nimbus-documentation.vercel.app/components/category/component}`
  - Link placed BEFORE `@example` block
- [ ] **@example block**: JSDoc includes `@example` block showing typical usage
- [ ] **@supportsStyleProps tag**: `@supportsStyleProps` tag present if
      component accepts Chakra UI style props (extends `HTMLChakraProps`,
      `RecipeVariantProps`, or forwards props to a styled component).
      For compound components, only tag the implementation files.
- [ ] **Lifecycle tag**: When the `.mdx` has `lifecycleState` Experimental,
      Alpha or Beta, the main export JSDoc has the matching `@experimental`,
      `@alpha` or `@beta` tag (see `docs/file-type-guidelines/main-component.md`
      "Lifecycle State Tag")
- [ ] **Compound parts JSDoc**: For compound components, EACH part has JSDoc in
      main file (NOT implementation files)
- [ ] **Part heading**: Each compound part's JSDoc includes heading:
      `# ComponentName.Part`
- [ ] **Complete example**: For compound components, main JSDoc shows complete
      usage example with all parts

#### Category 8: Import Conventions (7 items)

- [ ] **Ra prefix requirement**: React Aria imports NEVER unaliased (always use
      `Ra` prefix). Exception: `useObjectRef` is imported without the prefix.
- [ ] **Same-directory imports**: Slot/type/i18n imports use relative paths:
  - `./component.slots`
  - `./component.types`
  - `./component.i18n`
- [ ] **Cross-component imports**: Cross-component imports use DIRECT file
      paths:
  - ✅ Correct: `@/components/icon/icon` or `../button/button`
  - ❌ Wrong: `@/components/icon` or `../button`
- [ ] **Type-only imports**: Type-only imports use direct file paths:
  - ✅ Correct: `import type { ButtonProps } from '../button/button.types'`
  - ❌ Wrong: `import type { ButtonProps } from '../button'`
- [ ] **No barrel exports**: NO barrel exports for cross-component imports
      (causes circular dependencies)
- [ ] **Utils barrel OK**: Utils/hooks CAN use barrel exports: `@/utils`,
      `@/hooks` (these are safe)
- [ ] **Import organization**: Imports organized logically (React, third-party,
      internal, relative)

#### Category 9: Type Safety (6 items)

- [ ] **Explicit typing**: Component explicitly typed with props interface:
      `(props: ComponentProps) => JSX.Element`
- [ ] **Ref types**: Ref types match underlying element types
- [ ] **Children typing**: Children typed as `React.ReactNode` (or specific type
      if restricted)
- [ ] **Event handler types**: Event handlers properly typed (React Aria types
      OR standard React types)
- [ ] **Generic types**: Generic types used correctly if component handles
      collections
- [ ] **No any types**: No `any` types without explicit comment justification

#### Category 10: Integration & Testing (6 items)

- [ ] **Barrel export**: Component exported from directory's `index.ts` barrel
      export
- [ ] **Stories exist**: Storybook stories file exists:
      `{component}.stories.tsx`
- [ ] **Play functions**: Stories include play functions for interactive
      components
- [ ] **Recipe registered**: If component has styling, recipe registered in
      theme. Find the registration with `rg -il "<component>" packages/nimbus/src/theme`.
- [ ] **i18n defined**: If component has user-facing text, i18n messages defined
- [ ] **Build succeeds**: Component builds without errors:
      `pnpm --filter @commercetools/nimbus build`

### Total Validation Items: 64 across 10 categories

---
