# Menu Component

A flexible and accessible menu component for the Nimbus design system that
allows displaying menus with custom trigger elements.

## Features

- **Accessibility First**: Built with React Aria Components for full keyboard
  navigation and screen reader support
- **Flexible Styling**: Uses Chakra UI's slot recipe pattern for comprehensive
  theming
- **Custom Triggers**: Support for custom trigger elements via `asChild` prop
- **Rich Content**: Support for labels, descriptions, keyboard shortcuts,
  groups, and separators
- **Keyboard Navigation**: Full keyboard support with arrow keys, Enter, Escape,
  etc.
- **Focus Management**: Automatic focus handling and restoration

## Basic Usage

```tsx
import { Menu } from "@commercetools/nimbus";

function MyComponent() {
  return (
    <Menu onAction={(key) => console.log(`Selected: ${key}`)}>
      <Menu.Trigger>Actions</Menu.Trigger>
      <Menu.Content>
        <Menu.Item id="copy">Copy</Menu.Item>
        <Menu.Item id="cut">Cut</Menu.Item>
        <Menu.Item id="paste">Paste</Menu.Item>
      </Menu.Content>
    </Menu>
  );
}
```

## Using Custom Trigger Elements

The Menu component supports using custom trigger elements via the `asChild`
prop. This allows you to use any Button or IconButton as the trigger while
maintaining menu functionality.

### With Button Components

```tsx
import { Menu, Button, IconButton } from "@commercetools/nimbus";
import { KeyboardArrowDown, MoreVert } from "@commercetools/nimbus-icons";

function CustomTriggerExample() {
  return (
    <Menu onAction={(key) => handleAction(key)}>
      <Menu.Trigger asChild>
        <Button variant="solid" tone="primary">
          <KeyboardArrowDown />
          Primary Actions
        </Button>
      </Menu.Trigger>
      <Menu.Content>
        <Menu.Item id="copy">Copy</Menu.Item>
        <Menu.Item id="cut">Cut</Menu.Item>
        <Menu.Item id="paste">Paste</Menu.Item>
      </Menu.Content>
    </Menu>
  );
}
```

### With IconButton Components

```tsx
function IconButtonTriggerExample() {
  return (
    <Menu onAction={(key) => handleAction(key)}>
      <Menu.Trigger asChild>
        <IconButton variant="ghost" tone="neutral" aria-label="More options">
          <MoreVert />
        </IconButton>
      </Menu.Trigger>
      <Menu.Content>
        <Menu.Item id="edit">Edit</Menu.Item>
        <Menu.Item id="duplicate">Duplicate</Menu.Item>
        <Menu.Item id="archive">Archive</Menu.Item>
        <Menu.Separator />
        <Menu.Item id="delete" isDanger>
          Delete
        </Menu.Item>
      </Menu.Content>
    </Menu>
  );
}
```

## Advanced Usage

### With Rich Content

```tsx
<Menu onAction={(key) => handleAction(key)}>
  <Menu.Trigger asChild>
    <Button variant="outline">
      <KeyboardArrowDown />
      Edit Menu
    </Button>
  </Menu.Trigger>
  <Menu.Content>
    <Menu.Item id="copy">
      <Menu.ItemLabel>Copy</Menu.ItemLabel>
      <Menu.ItemDescription>Copy the selected text</Menu.ItemDescription>
      <Menu.ItemKeyboard>⌘C</Menu.ItemKeyboard>
    </Menu.Item>
    <Menu.Item id="cut">
      <Menu.ItemLabel>Cut</Menu.ItemLabel>
      <Menu.ItemDescription>Cut the selected text</Menu.ItemDescription>
      <Menu.ItemKeyboard>⌘X</Menu.ItemKeyboard>
    </Menu.Item>
  </Menu.Content>
</Menu>
```

### With Groups and Separators

```tsx
<Menu onAction={(key) => handleAction(key)}>
  <Menu.Trigger asChild>
    <Button variant="ghost">
      Format Options
      <KeyboardArrowDown />
    </Button>
  </Menu.Trigger>
  <Menu.Content>
    <Menu.Group>
      <Menu.GroupLabel>Text Style</Menu.GroupLabel>
      <Menu.Item id="bold">Bold</Menu.Item>
      <Menu.Item id="italic">Italic</Menu.Item>
    </Menu.Group>
    <Menu.Separator />
    <Menu.Group>
      <Menu.GroupLabel>Alignment</Menu.GroupLabel>
      <Menu.Item id="left">Left</Menu.Item>
      <Menu.Item id="center">Center</Menu.Item>
    </Menu.Group>
  </Menu.Content>
</Menu>
```

### Interactive States

```tsx
// Menu items with different states
<Menu onAction={handleAction}>
  <Menu.Trigger asChild>
    <Button variant="outline">Interactive States</Button>
  </Menu.Trigger>
  <Menu.Content>
    <Menu.Item id="normal">Normal Item</Menu.Item>
    <Menu.Item id="selected" isSelected>
      Selected Item
    </Menu.Item>
    <Menu.Item id="disabled" isDisabled>
      Disabled Item
    </Menu.Item>
    <Menu.Item id="danger" isDanger>
      Delete Account
    </Menu.Item>
    <Menu.Item id="loading" isLoading>
      Saving...
    </Menu.Item>
  </Menu.Content>
</Menu>

// Loading states for trigger and content
<Menu onAction={handleAction}>
  <Menu.Trigger asChild>
    <Button variant="ghost" isLoading>
      Loading...
    </Button>
  </Menu.Trigger>
  <Menu.Content>
    <Menu.Item id="item1">Item 1</Menu.Item>
  </Menu.Content>
</Menu>

<Menu onAction={handleAction}>
  <Menu.Trigger asChild>
    <Button variant="solid">Actions</Button>
  </Menu.Trigger>
  <Menu.Content isLoading>
    <Menu.Item id="item1">Item 1</Menu.Item>
  </Menu.Content>
</Menu>
```

## Component API

### Menu (Root)

| Prop            | Type                        | Default | Description                                        |
| --------------- | --------------------------- | ------- | -------------------------------------------------- |
| `onAction`      | `(key: Key) => void`        | -       | Handler called when an item is selected            |
| `onOpenChange`  | `(isOpen: boolean) => void` | -       | Handler called when menu open state changes        |
| `isOpen`        | `boolean`                   | -       | Whether the menu is open (controlled)              |
| `defaultOpen`   | `boolean`                   | -       | Whether the menu is open by default (uncontrolled) |
| `closeOnSelect` | `boolean`                   | `true`  | Whether to close menu when an item is selected     |

### Menu.Trigger

| Prop         | Type      | Default | Description                                                             |
| ------------ | --------- | ------- | ----------------------------------------------------------------------- |
| `asChild`    | `boolean` | `false` | Whether to use the child element as the trigger instead of a button     |
| `isDisabled` | `boolean` | `false` | Whether the trigger is disabled (only when not using asChild)           |
| `isLoading`  | `boolean` | `false` | Whether the trigger is in a loading state (only when not using asChild) |

When `asChild` is `false`, renders a default button trigger. When `asChild` is
`true`, applies menu trigger functionality to the child element (typically a
Button or IconButton).

### Menu.Content

| Prop         | Type                                         | Default          | Description                                    |
| ------------ | -------------------------------------------- | ---------------- | ---------------------------------------------- |
| `placement`  | `"bottom" \| "bottom start" \| "top" \| ...` | `"bottom start"` | Where to position the menu relative to trigger |
| `offset`     | `number`                                     | `4`              | Distance between trigger and menu              |
| `shouldFlip` | `boolean`                                    | `true`           | Whether to flip position when there's no space |
| `isLoading`  | `boolean`                                    | `false`          | Whether the content is in a loading state      |

### Menu.Item

| Prop         | Type      | Default | Description                                      |
| ------------ | --------- | ------- | ------------------------------------------------ |
| `id`         | `Key`     | -       | Unique identifier for the item                   |
| `isDisabled` | `boolean` | `false` | Whether the item is disabled                     |
| `isSelected` | `boolean` | `false` | Whether the item is currently selected           |
| `isDanger`   | `boolean` | `false` | Whether the item represents a destructive action |
| `isLoading`  | `boolean` | `false` | Whether the item is in a loading state           |
| `href`       | `string`  | -       | URL to navigate to (makes item a link)           |
| `target`     | `string`  | -       | Link target                                      |
| `textValue`  | `string`  | -       | Text value for accessibility                     |

### Other Components

- `Menu.ItemLabel` - Main label text for an item
- `Menu.ItemDescription` - Secondary description text
- `Menu.ItemKeyboard` - Keyboard shortcut display
- `Menu.Separator` - Visual separator between items/groups
- `Menu.Group` - Container for grouping related items
- `Menu.GroupLabel` - Label for a group of items

## Accessibility

The Menu component follows WAI-ARIA guidelines:

- Full keyboard navigation with arrow keys
- Enter and Space to select items
- Escape to close the menu
- Focus management and restoration
- Screen reader announcements
- Proper ARIA attributes and roles

## Theming

The Menu component uses Chakra UI's slot recipe system for theming. You can
customize the appearance by modifying the menu slot recipe in your theme
configuration.

## Architecture

Built using:

- **React Aria Components** for accessibility and behavior
- **Chakra UI** slot recipes for styling
- **TypeScript** for type safety
- Follows Nimbus design system patterns
