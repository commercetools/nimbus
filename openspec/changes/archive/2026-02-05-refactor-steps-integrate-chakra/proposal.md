# Change: Refactor Steps to Integrate Chakra UI's Steps Component

## Why

The current Steps component is "display-only" and requires consumers to manage
all state externally. This creates several problems:

1. **Consumer burden**: Consumers must manage step state, content visibility,
   and navigation logic themselves
2. **Agentic UI friction**: AI-generated interfaces struggle with scattered
   state management
3. **Missing content management**: Step content is always rendered; consumers
   must implement their own show/hide logic based on `data-state` attributes
4. **No navigation primitives**: No built-in triggers for prev/next navigation

Chakra UI's Steps component solves these problems with built-in state
management, content visibility control, and navigation triggers. Nimbus already
wraps Chakra components in other places (Spacer uses Box, layout components use
Chakra primitives), so this follows established patterns.

## What Changes

- **BREAKING**: Replace homegrown Steps implementation with Chakra Steps wrapper
- **BREAKING**: API changes to align with Chakra's compound component structure
- **ADD**: `Steps.Trigger` - Interactive step indicator (clickable)
- **ADD**: `Steps.Content` - Auto-shows/hides based on step state
- **ADD**: `Steps.CompletedContent` - Content shown when all steps complete
- **ADD**: `Steps.PrevTrigger` - Navigate to previous step
- **ADD**: `Steps.NextTrigger` - Navigate to next step
- **ADD**: Support for both controlled (`step`/`onStepChange`) and uncontrolled
  modes
- **MODIFY**: `Steps.Root` props align with Chakra (defaultStep, step,
  onStepChange, count, etc.)
- **REMOVE**: Manual `index` prop on `Steps.Item` (Chakra handles this
  automatically)
- **REMOVE**: Separate `Steps.Indicator` component (merged into `Steps.Trigger`)

## Impact

- **Affected specs**: `nimbus-steps`
- **Affected code**:
  - `packages/nimbus/src/components/steps/` - Complete rewrite
  - `packages/nimbus/src/theme/slot-recipes/` - Recipe adjustments
  - Stories and documentation - Full update required
- **Migration**: Consumers using current Steps must update to new API
- **Benefits**:
  - Reduced consumer code for step workflows
  - Better agentic UI support (markup-based navigation)
  - Built-in content visibility management
  - Proven Chakra API patterns

## API Comparison

### Current (display-only):

```tsx
const [step, setStep] = useState(1);

<Steps.Root step={step} count={3}>
  <Steps.List>
    <Steps.Item index={0}>
      <Steps.Indicator type="numeric" />
      <Steps.Content>
        <Steps.Label>Account</Steps.Label>
      </Steps.Content>
    </Steps.Item>
    <Steps.Separator />
    {/* ... */}
  </Steps.List>
</Steps.Root>;

{
  /* Consumer must manage content visibility separately */
}
{
  step === 0 && <AccountForm />;
}
{
  step === 1 && <ProfileForm />;
}
```

### Proposed (integrated):

```tsx
<Steps.Root defaultStep={0} count={3}>
  <Steps.List>
    <Steps.Item>
      <Steps.Trigger>Account</Steps.Trigger>
    </Steps.Item>
    <Steps.Item>
      <Steps.Trigger>Profile</Steps.Trigger>
    </Steps.Item>
  </Steps.List>

  <Steps.Content index={0}>
    <AccountForm />
  </Steps.Content>
  <Steps.Content index={1}>
    <ProfileForm />
  </Steps.Content>
  <Steps.CompletedContent>All done!</Steps.CompletedContent>

  <Steps.PrevTrigger asChild>
    <Button>Back</Button>
  </Steps.PrevTrigger>
  <Steps.NextTrigger asChild>
    <Button>Next</Button>
  </Steps.NextTrigger>
</Steps.Root>
```
