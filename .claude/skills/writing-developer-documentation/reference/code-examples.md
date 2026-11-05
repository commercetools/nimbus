# Developer Documentation: jsx live-dev Code Examples

## Code Examples (jsx live-dev Blocks)

### Requirements

**CRITICAL**: Use `jsx live-dev` blocks (NOT `jsx live`) for developer
documentation:

````markdown
```jsx live-dev
const App = () => <ComponentName>Developer Example</ComponentName>;
```
````

````

### Available Components

All Nimbus components are available globally—NO imports needed in examples:
- All Nimbus components (Button, Stack, Card, etc.)
- Icons namespace (Icons.Add, Icons.Close, etc.)
- React hooks (useState, useEffect, useCallback, etc.)

### Example Patterns

#### Import Statement Example

Always show the import at the beginning:

```markdown
### Import

```tsx
import { Button, type ButtonProps } from '@commercetools/nimbus';
````

````

#### Basic Implementation

```markdown
```jsx live-dev
const App = () => (
  <Button onPress={() => console.log('Pressed')}>
    Click Me
  </Button>
)
````

````

#### Controlled Component Pattern

```markdown
```jsx live-dev
const App = () => {
  const [value, setValue] = useState('');

  return (
    <Stack direction="column" gap="400">
      <TextInput
        value={value}
        onChange={setValue}
        placeholder="Type something..."
      />
      <Text>Current value: {value}</Text>
    </Stack>
  );
}
````

````
