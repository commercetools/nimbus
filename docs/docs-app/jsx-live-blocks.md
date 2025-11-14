# jsx-live Code Blocks

Interactive code examples in the Nimbus documentation site using jsx-live blocks.

## Overview

jsx-live blocks allow you to write interactive React code examples directly in MDX documentation. The code executes in the browser and renders as a live, editable component.

**Key Feature:** All Nimbus components are available globally without imports.

## Basic Usage

### Simple Example

````markdown
```jsx-live
const App = () => (
  <Button variant="solid">
    Click me
  </Button>
)
```
````

This renders as an interactive button that users can see and interact with.

### Required Pattern

Every jsx-live block **must** define an `App` component:

````markdown
```jsx-live
const App = () => {
  // Your component code
  return (
    <YourComponent />
  );
}
```
````

## Available Components

All Nimbus components are globally available without imports:

### Layout Components

```jsx-live
const App = () => (
  <Stack direction="column" gap="400">
    <Box padding="400" backgroundColor="neutral.3">
      Box 1
    </Box>
    <Box padding="400" backgroundColor="neutral.3">
      Box 2
    </Box>
  </Stack>
)
```

### Form Components

```jsx-live
const App = () => (
  <Stack direction="column" gap="400">
    <TextInput placeholder="Enter text" />
    <NumberInput defaultValue={42} />
    <Button variant="solid">Submit</Button>
  </Stack>
)
```

### Navigation Components

```jsx-live
const App = () => (
  <Menu.Root>
    <Menu.Trigger>
      Options <Icons.KeyboardArrowDown />
    </Menu.Trigger>
    <Menu.Content>
      <Menu.Item id="edit">Edit</Menu.Item>
      <Menu.Item id="delete">Delete</Menu.Item>
    </Menu.Content>
  </Menu.Root>
)
```

### Icons

Access icons through the `Icons` namespace:

```jsx-live
const App = () => (
  <Stack direction="row" gap="400" alignItems="center">
    <Icons.Add />
    <Icons.Delete />
    <Icons.Edit />
    <Icons.Check />
  </Stack>
)
```

## Using React Hooks

jsx-live blocks support all React hooks:

### useState

```jsx-live
const App = () => {
  const [count, setCount] = useState(0);

  return (
    <Stack direction="column" gap="400" alignItems="flex-start">
      <Text>Count: {count}</Text>
      <Button onClick={() => setCount(count + 1)}>
        Increment
      </Button>
    </Stack>
  );
}
```

### useEffect

```jsx-live
const App = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <Text>{time}</Text>;
}
```

### Custom Hooks

You can define and use custom hooks within the block:

```jsx-live
const App = () => {
  const useCounter = (initialValue = 0) => {
    const [count, setCount] = useState(initialValue);

    const increment = () => setCount(c => c + 1);
    const decrement = () => setCount(c => c - 1);
    const reset = () => setCount(initialValue);

    return { count, increment, decrement, reset };
  };

  const { count, increment, decrement, reset } = useCounter(10);

  return (
    <Stack direction="column" gap="400" alignItems="flex-start">
      <Text>Count: {count}</Text>
      <Stack direction="row" gap="300">
        <Button onClick={increment}>+</Button>
        <Button onClick={decrement}>-</Button>
        <Button onClick={reset}>Reset</Button>
      </Stack>
    </Stack>
  );
}
```

## Advanced Patterns

### Demonstrating All Variants

```jsx-live
const App = () => {
  const variants = ["solid", "subtle", "outline", "ghost"];

  return (
    <Stack direction="row" gap="400" alignItems="center">
      {variants.map((variant) => (
        <Button key={variant} variant={variant}>
          {variant}
        </Button>
      ))}
    </Stack>
  );
}
```

### Complex State Management

```jsx-live
const App = () => {
  const [todos, setTodos] = useState([
    { id: 1, text: "Learn Nimbus", done: true },
    { id: 2, text: "Build awesome UI", done: false }
  ]);
  const [input, setInput] = useState("");

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, {
        id: Date.now(),
        text: input,
        done: false
      }]);
      setInput("");
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ));
  };

  return (
    <Stack direction="column" gap="400">
      <Stack direction="row" gap="300">
        <TextInput
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="New todo"
        />
        <Button onClick={addTodo}>Add</Button>
      </Stack>
      <Stack direction="column" gap="200">
        {todos.map((todo) => (
          <Stack
            key={todo.id}
            direction="row"
            gap="300"
            alignItems="center"
          >
            <Checkbox
              isChecked={todo.done}
              onChange={() => toggleTodo(todo.id)}
            />
            <Text
              textDecoration={todo.done ? "line-through" : "none"}
              opacity={todo.done ? 0.6 : 1}
            >
              {todo.text}
            </Text>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}
```

### Compound Components

```jsx-live
const App = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <Stack direction="column" gap="400">
      <DatePicker.Root
        value={selectedDate}
        onChange={setSelectedDate}
      >
        <DatePicker.Trigger>
          {selectedDate
            ? selectedDate.toLocaleDateString()
            : "Select date"}
        </DatePicker.Trigger>
        <DatePicker.Calendar />
      </DatePicker.Root>
      {selectedDate && (
        <Text>Selected: {selectedDate.toLocaleDateString()}</Text>
      )}
    </Stack>
  );
}
```

## Styling and Layout

Use Nimbus layout components for structure:

```jsx-live
const App = () => (
  <Stack direction="column" gap="600">
    <Stack direction="row" gap="400" alignItems="center">
      <Badge colorPalette="primary">New</Badge>
      <Text fontSize="500" fontWeight="600">
        Product Title
      </Text>
    </Stack>

    <Box
      padding="500"
      backgroundColor="neutral.2"
      borderRadius="300"
    >
      <Text>Product description goes here</Text>
    </Box>

    <Stack direction="row" gap="300">
      <Button variant="solid">Buy Now</Button>
      <Button variant="outline">Learn More</Button>
    </Stack>
  </Stack>
)
```

## Common Patterns

### Form with Validation

```jsx-live
const App = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (value) => {
    if (!value) {
      setError("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      setError("Email is invalid");
    } else {
      setError("");
    }
  };

  return (
    <Stack direction="column" gap="400">
      <TextInput
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          validateEmail(e.target.value);
        }}
        placeholder="Enter email"
        isInvalid={!!error}
      />
      {error && (
        <Text color="critical.11" fontSize="350">
          {error}
        </Text>
      )}
    </Stack>
  );
}
```

### Controlled vs Uncontrolled

```jsx-live
const App = () => {
  const [controlled, setControlled] = useState("controlled");

  return (
    <Stack direction="column" gap="600">
      <Stack direction="column" gap="300">
        <Text fontWeight="600">Controlled</Text>
        <TextInput
          value={controlled}
          onChange={(e) => setControlled(e.target.value)}
        />
        <Text fontSize="350">Value: {controlled}</Text>
      </Stack>

      <Stack direction="column" gap="300">
        <Text fontWeight="600">Uncontrolled</Text>
        <TextInput defaultValue="uncontrolled" />
      </Stack>
    </Stack>
  );
}
```

## Limitations

### No Imports

You cannot import external libraries or modules:

````markdown
<!-- ❌ This won't work -->
```jsx-live
import axios from 'axios';  // Error!

const App = () => {
  // ...
}
```
````

All code must use globally available components and standard JavaScript/React APIs.

### No Async/Await at Top Level

Async operations must be inside functions:

```jsx-live
const App = () => {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    // Async operations inside functions work
    const response = await fetch('/api/data');
    const json = await response.json();
    setData(json);
  };

  return (
    <Button onClick={fetchData}>
      Fetch Data
    </Button>
  );
}
```

### Must Return JSX

The App component must return valid JSX:

````markdown
<!-- ✅ Correct -->
```jsx-live
const App = () => (
  <Button>Click</Button>
)
```

<!-- ❌ Incorrect -->
```jsx-live
const App = () => {
  console.log("Hello");
  // No return statement
}
```
````

## Best Practices

### DO

- ✅ Use jsx-live for all interactive examples
- ✅ Always define App component
- ✅ Use realistic, production-ready examples
- ✅ Demonstrate actual use cases
- ✅ Include proper error handling
- ✅ Use Nimbus layout components for structure
- ✅ Keep examples focused and clear

### DON'T

- ❌ Use regular markdown code blocks for interactive examples
- ❌ Forget to define App component
- ❌ Use toy/simplified examples that don't reflect reality
- ❌ Try to import external libraries
- ❌ Create overly complex examples
- ❌ Use inline styles (use Nimbus props instead)

## Troubleshooting

### Block Not Rendering

**Problem:** jsx-live block shows code but doesn't render

**Solutions:**
1. Ensure block starts with ` ```jsx-live `
2. Check that `const App = () => (` is defined
3. Verify component returns valid JSX
4. Check browser console for errors

### Components Not Found

**Problem:** Component name errors in console

**Solutions:**
1. Verify component is exported from `@commercetools/nimbus`
2. Check spelling and capitalization
3. For compound components, use `Component.Part` syntax
4. Check that component exists in Nimbus package

### State Not Updating

**Problem:** State changes don't reflect in UI

**Solutions:**
1. Ensure you're using `useState` correctly
2. Check that you're calling state setter function
3. Verify component is re-rendering
4. Look for state mutation bugs

## Related Documentation

- [MDX Format](./mdx-format.md) - Full MDX documentation guidelines
- [Component Documentation Guidelines](../nimbus/file-type-guidelines/documentation.md) - Writing component docs
