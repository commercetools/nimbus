# Design: Steps Integration with Chakra UI

## Context

The Steps component was originally built as a "display-only" progress indicator.
A PR review conversation identified that this approach creates unnecessary
burden on consumers who must manage:

1. Step state (`useState` for current step)
2. Content visibility (conditional rendering based on step)
3. Navigation logic (increment/decrement step state)

This is especially problematic for AI-generated UIs where scattered state
management is unreliable. Chakra UI's Steps component provides all these
features built-in.

### Stakeholders

- **Consumers**: Need simpler API for step workflows
- **Agentic UIs**: Need markup-based navigation (not state manipulation)
- **Nimbus team**: Want consistent patterns with other wrapped components

## Goals / Non-Goals

### Goals

- Wrap Chakra UI's Steps component with Nimbus styling
- Support both controlled and uncontrolled usage patterns (chakra does this already)
- Provide navigation triggers (PrevTrigger, NextTrigger)
- Auto-manage content visibility based on step state
- Maintain WCAG 2.1 AA compliance
- Apply Nimbus design tokens via recipe customization
- Allow for colorPalette support (Chakra Steps component does this out of the box)

### Non-Goals

- Supporting React Aria's tabs as underlying primitive (considered but rejected)
- Creating custom state management beyond what Chakra provides
- Maintaining backward compatibility with current API (breaking change approved)

## Decisions

### Decision 1: Wrap Chakra Steps, Don't Use React Aria Tabs

**What**: Use Chakra UI's Steps component as the foundation, not React Aria's
Tabs.

**Why**:

- Chakra Steps is purpose-built for sequential workflows
- It provides PrevTrigger/NextTrigger out of the box
- CompletedContent handles the "all done" state
- Tabs are for parallel content switching, not sequential progress

**Alternatives considered**:

- React Aria Tabs: Would require significant wrapper logic for sequential
  behavior
- Keep homegrown: Doesn't provide the convenience features consumers need

### Decision 2: Adopt Chakra's API Surface Directly

**What**: Mirror Chakra's compound component structure rather than creating a
custom API.

**Why**:

- Chakra's API is proven and well-documented
- Reduces maintenance burden (changes flow through naturally)
- Familiar to developers who know Chakra
- Enables full feature set without additional wrapper code

**API mapping**: | Chakra Component | Nimbus Component | Notes |
|------------------|------------------|-------| | Steps.Root | Steps.Root | Add
Nimbus recipe styling | | Steps.List | Steps.List | Apply slot styling | |
Steps.Item | Steps.Item | Auto-indexed, no manual index | | Steps.Trigger |
Steps.Trigger | Replaces our Indicator | | Steps.Content | Steps.Content | Auto
show/hide content | | Steps.CompletedContent | Steps.CompletedContent |
Completion state content | | Steps.PrevTrigger | Steps.PrevTrigger | Navigate
back | | Steps.NextTrigger | Steps.NextTrigger | Navigate forward | |
Steps.Indicator | Steps.Indicator | Visual indicator within Trigger | |
Steps.Separator | Steps.Separator | Line between steps |

### Decision 3: Keep Nimbus Recipe for Visual Customization

**What**: Maintain the existing Nimbus recipe system for styling.

**Why**:

- Ensures design token compliance
- Allows Nimbus-specific visual variants (size, orientation)
- Separates styling concerns from behavioral concerns

**Implementation approach**:

- Import Chakra Steps components
- Wrap with Nimbus slot components that apply recipes
- Forward all Chakra props through

### Decision 4: Support Both Controlled and Uncontrolled Modes

**What**: Support both `defaultStep` (uncontrolled) and `step`/`onStepChange`
(controlled), which both Chakra supports out of the box.

**Why**:

- Uncontrolled: Simpler for most use cases, better for agentic UIs
- Controlled: Needed when step changes must be validated or coordinated with
  external state

**Props**:

```typescript
interface StepsRootProps {
  // Uncontrolled
  defaultStep?: number;

  // Controlled
  step?: number;
  onStepChange?: (details: { step: number }) => void;

  // Required
  count: number;

  // Styling
  size?: "xs" | "sm" | "md";
  orientation?: "horizontal" | "vertical";
}
```

## Risks / Trade-offs

### Risk 1: Breaking Change for Existing Consumers

**Risk**: Any current users must migrate to new API.

**Mitigation**:

- Component hasn't shipped widely (still in PR)
- Provide clear migration guide in documentation
- Breaking change was explicitly approved

### Risk 2: Chakra Steps May Not Have All Nimbus Visual Variants

**Risk**: Chakra's recipe may not support all our size/orientation combinations.

**Mitigation**:

- Our recipe system overrides Chakra's defaults
- CSS variables from our recipe take precedence
- Test all variant combinations

### Risk 3: Dependency on Chakra's Steps Stability

**Risk**: Chakra could change Steps API in future versions.

**Mitigation**:

- Chakra follows semver; breaking changes would be major version
- We already depend on Chakra for core functionality
- Our wrapper provides abstraction layer if needed

## Migration Plan

### For Existing Code

1. Update imports (same location, different API)
2. Remove external state management if not needed
3. Move step content inside `Steps.Content` components
4. Replace `Steps.Indicator` with `Steps.Trigger` containing indicator content
5. Add `Steps.PrevTrigger`/`Steps.NextTrigger` for navigation

### Example Migration

**Before**:

```tsx
const [step, setStep] = useState(0);

<Steps.Root step={step} count={3}>
  <Steps.List>
    <Steps.Item index={0}>
      <Steps.Indicator type="numeric" />
      <Steps.Content>
        <Steps.Label>Account</Steps.Label>
      </Steps.Content>
    </Steps.Item>
    <Steps.Separator />
    ...
  </Steps.List>
</Steps.Root>;

{
  step === 0 && <AccountForm onNext={() => setStep(1)} />;
}
```

**After**:

```tsx
<Steps.Root defaultStep={0} count={3}>
  <Steps.List>
    <Steps.Item>
      <Steps.Trigger>
        <Steps.Indicator />
        Account
      </Steps.Trigger>
    </Steps.Item>
    <Steps.Separator />
    ...
  </Steps.List>
  <Steps.Content index={0}>
    <AccountForm />
  </Steps.Content>
  ...
  <Steps.NextTrigger asChild>
    <Button>Next</Button>
  </Steps.NextTrigger>
</Steps.Root>
```

## Open Questions

1. **Should Steps.Indicator support our custom numeric/icon types?**
   - Chakra's Indicator is simpler; we may need to extend for feature parity
   - Resolution: Investigate Chakra's Indicator API during implementation

2. **Linear vs non-linear navigation?**
   - Chakra supports `linear` prop to restrict forward-only progress
   - Resolution: Include this prop in our wrapper

3. **Description component?**
   - Current API has Steps.Description; Chakra may handle differently
   - Resolution: Evaluate during implementation, may compose within Trigger
