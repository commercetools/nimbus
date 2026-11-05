# Writing Types Validation Checklist

### Validation Checklist

You MUST validate against these requirements:

#### File Structure

- [ ] Types file exists with `.ts` extension
- [ ] Section dividers in correct order (Recipe → Slot → Helper → Main)
- [ ] Only consumer-facing types in file
- [ ] Internal types colocated with usage

#### Naming Conventions

- [ ] All naming follows conventions table
- [ ] Props follow `{ComponentName}Props` pattern
- [ ] React Aria imports use "Ra" prefix
- [ ] Recipe props: `{Component}RecipeProps`
- [ ] Slot props: `{Component}RootSlotProps`, `{Component}{Part}SlotProps`

#### Type Construction

- [ ] Uses `type` syntax (not `interface`)
- [ ] Extends appropriate slot props
- [ ] Recipe variants automatically inherited (not explicit)
- [ ] Conflicts explicitly documented in Helper Types
- [ ] Four-layer pattern followed

#### Documentation

- [ ] JSDoc comments for all properties
- [ ] Default values documented with `@default`
- [ ] Complex props have `@example` tags
- [ ] Event handlers properly typed
- [ ] No file-level JSDoc preamble

#### Type Safety

- [ ] Generic types used appropriately
- [ ] No inline complex types
- [ ] No implementation details leaked
- [ ] Ref forwarding included in public props
