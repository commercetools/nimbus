# Writing Slots Validation Checklist

### Validation Checklist

You MUST validate against these requirements:

#### File Structure

- [ ] Slots file exists with `.tsx` extension
- [ ] `SlotComponent` utility type imported from `../utils/slot-types`
- [ ] Recipe imported from recipe file
- [ ] Context created with appropriate function

#### Exports (CRITICAL)

- [ ] **All slot components have explicit return type annotations** using
      `SlotComponent<TElement, TProps>`
- [ ] **Types exported** alongside components
- [ ] **Type name = Component name + "Props"**
- [ ] Types use `HTMLChakraProps` or appropriate interface

#### Naming Conventions

- [ ] Single-slot: `{Component}Root` + `{Component}RootProps`
- [ ] Multi-slot root: `{Component}RootSlot` + `{Component}RootSlotProps`
- [ ] Multi-slot parts: `{Component}{Part}Slot` + `{Component}{Part}SlotProps`

#### Context Usage

- [ ] Root slot uses `withProvider` (for multi-slot)
- [ ] Child slots use `withContext` (for multi-slot)
- [ ] Single-slot uses `withContext`
- [ ] Context parameters correct (element type, slot name)

#### Type Safety

- [ ] Element types match HTML elements
- [ ] TypeScript generics match element types
- [ ] Slot names match recipe slot definitions
- [ ] Props interfaces appropriate for element type

#### Integration

- [ ] Recipe imported correctly
- [ ] Slot names match recipe slots array
- [ ] Types compatible with component usage
- [ ] asChild pattern supported where needed
