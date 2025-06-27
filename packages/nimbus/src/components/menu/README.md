# Menu Component

A flexible and accessible menu component for the Nimbus design system that
allows displaying menus in many different looks and configurations.

## Features

- **Accessibility First**: Built with React Aria Components for full keyboard
  navigation and screen reader support
- **Flexible Styling**: Uses Chakra UI's slot recipe pattern for comprehensive
  theming
- **Multiple Variants**: Supports different visual styles (solid, outline,
  ghost)
- **Size Options**: Available in small, medium, and large sizes
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

## Advanced Usage

### With Rich Content

```tsx
<Menu onAction={(key) => handleAction(key)}>
  <Menu.Trigger>Edit</Menu.Trigger>
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
  <Menu.Trigger>Format</Menu.Trigger>
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

### Different Sizes and Variants

```tsx
<Menu size="lg" variant="outline" onAction={handleAction}>
  <Menu.Trigger>Large Outline Menu</Menu.Trigger>
  <Menu.Content>
    <Menu.Item id="item1">Item 1</Menu.Item>
    <Menu.Item id="item2">Item 2</Menu.Item>
  </Menu.Content>
</Menu>
```

## Component API

### Menu (Root)

| Prop            | Type                              | Default   | Description                                        |
| --------------- | --------------------------------- | --------- | -------------------------------------------------- |
| `size`          | `"sm" \| "md" \| "lg"`            | `"md"`    | Size of the menu                                   |
| `variant`       | `"solid" \| "outline" \| "ghost"` | `"solid"` | Visual variant                                     |
| `onAction`      | `(key: Key) => void`              | -         | Handler called when an item is selected            |
| `onOpenChange`  | `(isOpen: boolean) => void`       | -         | Handler called when menu open state changes        |
| `isOpen`        | `boolean`                         | -         | Whether the menu is open (controlled)              |
| `defaultOpen`   | `boolean`                         | -         | Whether the menu is open by default (uncontrolled) |
| `closeOnSelect` | `boolean`                         | `true`    | Whether to close menu when an item is selected     |

### Menu.Trigger

The trigger button that opens the menu. Accepts all standard button props.

### Menu.Content

| Prop         | Type                                         | Default          | Description                                    |
| ------------ | -------------------------------------------- | ---------------- | ---------------------------------------------- |
| `placement`  | `"bottom" \| "bottom start" \| "top" \| ...` | `"bottom start"` | Where to position the menu relative to trigger |
| `offset`     | `number`                                     | `4`              | Distance between trigger and menu              |
| `shouldFlip` | `boolean`                                    | `true`           | Whether to flip position when there's no space |

### Menu.Item

| Prop         | Type      | Default | Description                            |
| ------------ | --------- | ------- | -------------------------------------- |
| `id`         | `Key`     | -       | Unique identifier for the item         |
| `isDisabled` | `boolean` | `false` | Whether the item is disabled           |
| `href`       | `string`  | -       | URL to navigate to (makes item a link) |
| `target`     | `string`  | -       | Link target                            |
| `textValue`  | `string`  | -       | Text value for accessibility           |

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
