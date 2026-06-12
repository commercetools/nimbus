## REMOVED Requirements

### Requirement: DraggableList Component

**Reason:** Replaced by standalone GridList + `dragAndDropHooks` prop. The
DraggableList component hard-wired drag-and-drop into a GridList wrapper,
preventing consumers from using GridList without D&D or using D&D on other
collection types. The `dragAndDropHooks` pattern (already used by DataTable and
Tree) is the standard across all Nimbus collection components.

**Migration:**

```tsx
// Before
import { DraggableList } from '@commercetools/nimbus';

<DraggableList.Root items={items} onReorder={handleReorder}>
  {item => <DraggableList.Item>{item.name}</DraggableList.Item>}
</DraggableList.Root>

// After
import { GridList } from '@commercetools/nimbus';
import { useDragAndDrop } from 'react-aria-components';

const { dragAndDropHooks } = useDragAndDrop({ ... });

<GridList.Root dragAndDropHooks={dragAndDropHooks} items={items}>
  {item => <GridList.Item>{item.name}</GridList.Item>}
</GridList.Root>
```

DraggableList is retained with runtime deprecation warnings during the migration
period and removed in a subsequent major release.
