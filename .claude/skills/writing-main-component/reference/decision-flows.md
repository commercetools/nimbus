# Decision Flows

## Decision Flows

Use these decision flows to determine the correct patterns for your component:

### Flow 1: Component Architecture Decision

```mermaid
flowchart TD
    Start[New Component] --> Q1{Multiple<br/>related parts?}
    Q1 -->|No| Q2{Complex state<br/>or composition?}
    Q1 -->|Yes| Q3{Need state<br/>sharing?}

    Q2 -->|No| SimpleSingle[Simple Single Component<br/>━━━━━━━━━━━━━━━━━━<br/>Examples: Button, Badge, Checkbox<br/>Pattern: Direct implementation<br/>File: One main file with logic]
    Q2 -->|Yes| ComplexSingle[Complex Single Component<br/>━━━━━━━━━━━━━━━━━━<br/>Example: SplitButton<br/>Pattern: Composition + child processing<br/>File: One main file, complex logic]

    Q3 -->|Yes| ComplexCompound[Complex Compound<br/>━━━━━━━━━━━━━━━━━━<br/>Examples: Drawer, Menu, Tabs<br/>Pattern: Context management<br/>Files: Main export + components/ dir]
    Q3 -->|No| SimpleCompound[Simple Compound<br/>━━━━━━━━━━━━━━━━━━<br/>Examples: Tooltip, Card<br/>Pattern: Direct React Aria wrappers<br/>Files: Main export + components/ dir]

    SimpleSingle --> Impl1[Implementation in main file<br/>React Aria hooks/components<br/>Standard ref forwarding]
    ComplexSingle --> Impl2[Implementation in main file<br/>Child processing + composition<br/>Multiple internal refs]
    SimpleCompound --> Impl3[Exports only in main file<br/>Components in components/ directory<br/>Direct React Aria wrappers]
    ComplexCompound --> Impl4[Exports only in main file<br/>Components in components/ directory<br/>Context + state management]
```

**Key Questions:**

- Multiple parts? → Compound
- Parts need coordination? → Complex Compound
- Single element? → Single
- Complex logic? → Complex Single

---

### Flow 2: Ref Forwarding Pattern Decision

```mermaid
flowchart TD
    Start[Need ref forwarding?] --> Q1{Component wraps<br/>React Aria component<br/>or hook?}
    Q1 -->|Yes, uses hooks| Pattern1[Merged Ref Pattern<br/>━━━━━━━━━━━━━━━━<br/>const localRef = useRef<T>null<br/>const ref = useObjectRef mergeRefs localRef forwardedRef<br/><br/>Use: React Aria hooks need refs]
    Q1 -->|Yes, wraps component| Pattern2[Simple Forward Pattern<br/>━━━━━━━━━━━━━━━━<br/>const ref: forwardedRef  = props<br/><SlotComponent ref=forwardedRef asChild><br/>  <RaComponent>children</RaComponent><br/></SlotComponent><br/><br/>Use: Simple React Aria wrappers]
    Q1 -->|No| Q2{Component is<br/>interactive?}

    Q2 -->|Yes| Pattern1
    Q2 -->|No| Pattern3[No Ref Needed<br/>━━━━━━━━━━━━━━━━<br/>Layout-only component<br/>No DOM access required<br/><br/>Use: Cards, containers]

    Pattern1 --> Code1[Implementation:<br/>━━━━━━━━━━━<br/>const localRef = useRef<HTMLElement>null<br/>const ref = useObjectRef mergeRefs localRef forwardedRef<br/>const buttonProps  = useButton ...props  ref<br/>return <ButtonSlot ref=ref ...buttonProps/>]
    Pattern2 --> Code2[Implementation:<br/>━━━━━━━━━━━<br/>const ref: forwardedRef  = props<br/>return <br/>  <SlotComponent ref=ref asChild><br/>    <RaComponent>children</RaComponent><br/>  </SlotComponent><br/>]
    Pattern3 --> Code3[Implementation:<br/>━━━━━━━━━━━<br/>No ref handling needed<br/>return <SlotComponent>children</SlotComponent>]
```

**When to Use Each Pattern:**

- **Merged Ref**: React Aria hooks (useButton, useCheckbox) need refs
- **Simple Forward**: Wrapping React Aria components
- **No Ref**: Layout components without DOM interaction

---

### Flow 3: React Aria Integration Decision

```mermaid
flowchart TD
    Start[Need accessibility?] --> Q1{Interactive<br/>component?}
    Q1 -->|No| NoAria[No React Aria Needed<br/>━━━━━━━━━━━━━━━━<br/>Use semantic HTML<br/>Examples: Card, Container, Text<br/><br/>Pattern: Plain slots]
    Q1 -->|Yes| Q2{React Aria has<br/>component for this?}

    Q2 -->|No| UseHooks[Use React Aria Hooks<br/>━━━━━━━━━━━━━━━━<br/>Examples:<br/>- useButton<br/>- useCheckbox<br/>- useSwitch<br/>- useToggleButton<br/><br/>Pattern: Apply hook returns to elements]
    Q2 -->|Yes| Q3{Need custom<br/>behavior beyond<br/>React Aria?}

    Q3 -->|Yes| UseHooks
    Q3 -->|No| UseComponents[Use React Aria Components<br/>━━━━━━━━━━━━━━━━<br/>Examples:<br/>- <RaButton><br/>- <RaDialog><br/>- <RaMenu><br/>- <RaTabs><br/><br/>Pattern: Wrap with slot using asChild]

    UseComponents --> Wrap[<SlotComponent asChild><br/>  <RaComponent ...props><br/>    children<br/>  </RaComponent><br/></SlotComponent>]
    UseHooks --> Apply[const hookResult  = useHook ...props  ref<br/><SlotComponent ...hookResult><br/>  children<br/></SlotComponent>]
    NoAria --> Semantic[<SlotComponent ...props><br/>  children<br/></SlotComponent>]

    Wrap --> Done[Component complete]
    Apply --> Done
    Semantic --> Done
```

**Decision Criteria:**

- **No React Aria**: Layout-only components (Card, Container)
- **React Aria Components**: Standard interactive elements with no custom logic
- **React Aria Hooks**: Need custom behavior or React Aria doesn't have
  component

---

### Flow 4: Import Strategy Decision

```mermaid
flowchart TD
    Start[Need to import?] --> Q1{Same component<br/>directory?}
    Q1 -->|Yes| Relative[Use Relative Path<br/>━━━━━━━━━━━━━━━━<br/>./component.slots<br/>./component.types<br/>./component.i18n<br/><br/>Rationale: Internal files]
    Q1 -->|No| Q2{Different<br/>component<br/>directory?}

    Q2 -->|Yes| Direct[Use DIRECT File Import<br/>━━━━━━━━━━━━━━━━<br/>✅ @/components/icon/icon<br/>✅ ../button/button.types<br/>❌ @/components/icon<br/>❌ ../button<br/><br/>Rationale: Avoid circular dependencies]
    Q2 -->|No| Q3{Utils or hooks<br/>package?}

    Q3 -->|Yes| Barrel[Use Barrel Export<br/>━━━━━━━━━━━━━━━━<br/>@/utils<br/>@/hooks<br/>@/theme<br/><br/>Rationale: No circular dependency risk]
    Q3 -->|No| Q4{React Aria<br/>import?}

    Q4 -->|Yes| RaPrefix[Import with Ra Prefix<br/>━━━━━━━━━━━━━━━━<br/>import  Button as RaButton  from react-aria-components<br/>import type  ButtonProps as RaButtonProps  from react-aria-components<br/><br/>Rationale: Avoid naming conflicts]
    Q4 -->|No| Standard[Standard Import<br/>━━━━━━━━━━━━━━━━<br/>Follow TypeScript conventions]

    Relative --> Example1[Example:<br/>import  ButtonSlot  from ./button.slots<br/>import type  ButtonProps  from ./button.types]
    Direct --> Example2[Example:<br/>import  Icon  from @/components/icon/icon<br/>import type  ButtonProps  from ../button/button.types]
    Barrel --> Example3[Example:<br/>import  extractStyleProps  from @/utils<br/>import  useDisclosure  from @/hooks]
    RaPrefix --> Example4[Example:<br/>import  Button as RaButton  from react-aria-components<br/>const props = useButton...]
    Standard --> Example5[Example:<br/>import React from react<br/>import plain message objects]
```

**Import Strategy Summary:** | Location | Pattern | Reason |
|----------|---------|--------| | Same directory | Relative (`./file`) |
Internal files | | Other component | Direct file (`@/components/name/name`) |
Avoid circular deps | | Utils/hooks | Barrel (`@/utils`) | Safe for barrel
exports | | React Aria | Ra prefix (`as RaButton`) | Avoid name conflicts |

---
