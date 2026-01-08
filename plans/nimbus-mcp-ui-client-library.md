# Nimbus MCP-UI Client Library

## Goal

Enable consuming applications to render Nimbus components from an MCP-UI server with minimal configuration.

**Option A (now):** Batteries-included with pre-wired Nimbus components.
**Option B (future):** Custom component support - architecture should allow this without breaking changes.

---

## Key Concept: Server Owns the DOM

**The MCP-UI server is the source of truth for all UI state.**

```
┌─────────────────────────────────────────────────────────────┐
│                        SERVER                                │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐      │
│  │ Remote DOM  │◄───│ Orchestrator│◄───│  MCP Tools  │      │
│  │ (source of  │    │ (LLM/Agent) │    │             │      │
│  │   truth)    │    └─────────────┘    └─────────────┘      │
│  └──────┬──────┘                                             │
└─────────┼───────────────────────────────────────────────────┘
          │ WebSocket (mutations down, events up)
          ▼
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT                                │
│  ┌─────────────┐    ┌─────────────┐                         │
│  │   Renderer  │───►│   Nimbus    │───► User sees UI        │
│  │             │    │ Components  │                         │
│  └─────────────┘    └──────┬──────┘                         │
│                            │ User clicks/types               │
│                            ▼                                 │
│                     Events sent back                         │
└─────────────────────────────────────────────────────────────┘
```

**The client never "handles" events in the sense of updating UI state.** It only:

1. Renders what the server tells it to render
2. Sends user interactions back to the server
3. Re-renders when the server sends new DOM mutations

---

## Event Routing (Two Types)

Events are categorized by whether they need orchestrator (LLM) attention:

### 1. Orchestrator Events → `onAction` callback

User decisions that need LLM processing:

- Button clicks (LLM decides what happens next)
- Form submissions (LLM processes the data)
- Row selections (LLM acts on selection)

### 2. Sync Events → Direct to server

State changes that just need DOM sync, no LLM decision:

- Drawer open/close
- Accordion expand/collapse
- Input value changes (before submit)

**The library routes automatically based on component config.** Consumers only handle orchestrator events.

```tsx
<McpUiProvider
  serverUrl="http://localhost:3001"
  onAction={(action) => {
    // Only receives events that need orchestrator attention
    // Sync events are handled automatically
    await langGraph.submitAction(action);
  }}
>
  <RemoteRenderer uri="/my-ui" />
</McpUiProvider>
```

---

## Simplified Approach: Single Package

Start with **one package**: `@mcp-ui/nimbus`

```tsx
import { McpUiProvider, RemoteRenderer } from '@mcp-ui/nimbus';

function App() {
  return (
    <McpUiProvider
      serverUrl="http://localhost:3001"
      onAction={(action) => myOrchestrator.handle(action)}
    >
      <RemoteRenderer uri="/my-ui" />
    </McpUiProvider>
  );
}
```

**Why single package?**

- Simpler for consumers (one install, one import)
- Internal structure can be refactored without breaking changes
- Split into multiple packages later only if there's actual demand

---

## Provider API

```typescript
interface McpUiProviderProps {
  /** WebSocket URL for MCP-UI server */
  serverUrl: string;

  children: React.ReactNode;

  /**
   * Handle orchestrator events (button clicks, form submits, etc.)
   * Sync events (drawer close, accordion toggle) go directly to server.
   */
  onAction?: (action: Action) => void | Promise<void>;

  /** Optional: Called when connection state changes */
  onConnectionChange?: (connected: boolean) => void;
}

interface Action {
  type: string;        // e.g., 'button.press', 'form.submit'
  elementId: string;   // From component's `id` prop
  uri: string;         // Which RemoteRenderer
  payload: unknown;    // Event-specific data
  timestamp: number;
}
```

---

## RemoteRenderer API

```typescript
interface RemoteRendererProps {
  /** Server-generated URI for this component tree */
  uri: string;

  /** Initial content from MCP resource response (optional - can hydrate from server) */
  initialContent?: RemoteDomContent;

  /** Content to show while loading */
  fallback?: React.ReactNode;

  /** Called when an error occurs */
  onError?: (error: Error) => void;
}

interface RemoteDomContent {
  type: 'remoteDom';
  tree: RemoteDomNode | null;
  framework: 'react';
}
```

**Usage pattern:**

```tsx
// URI and content come from server/orchestrator response
const resource = orchestratorResponse.uiResources[0];

<RemoteRenderer
  uri={resource.uri}
  initialContent={JSON.parse(resource.text)}
  fallback={<Spinner />}
/>
```

**How it works:**

1. Server creates component → returns resource with `uri` + initial content
2. Orchestrator passes resource to client
3. Client renders `RemoteRenderer` with uri and initialContent
4. Renderer subscribes to WebSocket updates for that URI
5. Future mutations stream in, component re-renders

---

## Connection Handling

### Connection States

```typescript
type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'error';
```

Provider exposes connection state via context:

```tsx
function MyComponent() {
  const { connectionState, error } = useMcpUi();

  if (connectionState === 'connecting') return <Spinner />;
  if (connectionState === 'error') return <Text>Error: {error?.message}</Text>;

  return <RemoteRenderer uri={resource.uri} initialContent={resource.content} />;
}
```

### Reconnection

- Auto-reconnect on disconnect with exponential backoff
- Consumer can disable via `autoReconnect={false}`
- `onConnectionChange` callback fires on state changes

### Multiple RemoteRenderers

Multiple renderers share a single WebSocket connection. Each subscribes to its own URI:

```tsx
<McpUiProvider serverUrl="ws://localhost:3001">
  {/* Each renderer subscribes to updates for its URI */}
  {uiResources.map(resource => (
    <RemoteRenderer
      key={resource.uri}
      uri={resource.uri}
      initialContent={resource.content}
    />
  ))}
</McpUiProvider>
```

---

## Error Handling

### Error Types

```typescript
type McpUiError =
  | { type: 'connection'; message: string }
  | { type: 'unknown_element'; elementName: string }
  | { type: 'render'; componentName: string; error: Error };
```

### Unknown Element Handling

When server sends an element not in registry:

1. Log warning to console
2. Render nothing (or placeholder in dev mode)
3. Call `onError` if provided

### Component Render Errors

Wrap components in error boundary. On error:

1. Render error fallback
2. Call `onError` callback
3. Other components continue rendering

---

## Component Registry

```typescript
interface ComponentConfig {
  component: React.ComponentType;
  isVoid?: boolean;
  events?: EventConfig[];
}

interface EventConfig {
  /** React prop name (e.g., 'onPress', 'onOpenChange') */
  prop: string;
  /** If true, goes to onAction. If false, syncs directly to server. */
  requiresOrchestrator: boolean;
}

const registry: Record<string, ComponentConfig> = {
  // Orchestrator events - need LLM decision
  'nimbus-button': {
    component: Button,
    events: [{ prop: 'onPress', requiresOrchestrator: true }],
  },
  'nimbus-data-table': {
    component: DataTable,
    events: [{ prop: 'onRowClick', requiresOrchestrator: true }],
  },

  // Sync events - just update server DOM
  'nimbus-drawer-root': {
    component: Drawer.Root,
    events: [{ prop: 'onOpenChange', requiresOrchestrator: false }],
  },
  'nimbus-accordion-root': {
    component: Accordion.Root,
    events: [{ prop: 'onExpandedChange', requiresOrchestrator: false }],
  },

  // No events
  'nimbus-text': { component: Text },
  'nimbus-badge': { component: Badge },
};
```

---

## Wrapper Factory

```typescript
function createWrapper(config: ComponentConfig) {
  return function Wrapped(props) {
    const { dispatchAction, syncToServer, uri } = useMcpUi();

    const enhanced = { ...props };

    config.events?.forEach(({ prop, requiresOrchestrator }) => {
      const original = props[prop];
      enhanced[prop] = (event) => {
        const action = {
          type: `${config.component.displayName}.${prop}`,
          elementId: props.id,
          uri,
          payload: event,
          timestamp: Date.now(),
        };

        if (requiresOrchestrator) {
          dispatchAction(action);  // → onAction callback
        } else {
          syncToServer(action);    // → WebSocket directly
        }

        original?.(event);
      };
    });

    return <config.component {...enhanced} />;
  };
}
```

---

## What We Keep from POC

| POC File                   | Keep                    | Notes                           |
| -------------------------- | ----------------------- | ------------------------------- |
| `remote-dom-renderer.tsx`  | Core rendering logic    | Simplify registry handling      |
| `use-remote-connection.ts` | WebSocket connection    | As-is                           |
| `use-mutation-stream.ts`   | Mutation processing     | As-is                           |
| Component wrappers         | Convert to registry     | Remove individual wrapper files |
| `prop-injector.tsx`        | For compound components | As-is                           |

---

## Orchestration Patterns

The library supports multiple orchestration patterns. Choose based on your architecture.

### Pattern 1: Server-Side Orchestrator (Simplest)

MCP-UI server handles events directly. No external orchestrator needed.

```text
┌─────────────────┐                ┌─────────────────┐
│   MCP-UI        │   WebSocket    │     Client      │
│   Server        │◄──────────────►│     (React)     │
└─────────────────┘                └─────────────────┘
        │
        │ Server's event handlers
        │ update Remote DOM directly
        └─────────────────────────
```

```tsx
// No onAction needed - events go to server, server handles them
<McpUiProvider serverUrl="ws://localhost:3001">
  <RemoteRenderer uri="/ui" />
</McpUiProvider>
```

### Pattern 2: External Orchestrator (LangGraph, custom backend, etc.)

Orchestrator connects to MCP-UI server as MCP client. Client routes actions to orchestrator.

```text
┌─────────────────┐                ┌─────────────────┐                ┌─────────────────┐
│  Orchestrator   │  MCP Protocol  │   MCP-UI        │   WebSocket    │     Client      │
│  (LangGraph,    │◄──────────────►│   Server        │◄──────────────►│     (React)     │
│   custom, etc.) │                └─────────────────┘                └─────────────────┘
└─────────────────┘                        │
        │                                  │
        │ calls MCP tools to               │ maintains Remote DOM
        │ update UI                        │ streams mutations
        └──────────────────────────────────┘
```

```tsx
<McpUiProvider
  serverUrl="ws://localhost:3001"
  onAction={(action) => myOrchestrator.handle(action)}
>
  <RemoteRenderer uri="/ui" />
</McpUiProvider>
```

**Action flow:**

1. User clicks button → client `onAction` fires
2. Client sends action to orchestrator (your code)
3. Orchestrator processes, calls MCP tools on MCP-UI server
4. MCP-UI server updates Remote DOM
5. Mutations stream to client via WebSocket
6. Client re-renders

### Pattern 3: LangGraph

LangGraph connects as MCP client. All component data flows through MCP-UI server (not LangGraph stream).

```text
┌─────────────────┐
│    LangGraph    │──Stream──► Chat messages only
│                 │
└────────┬────────┘
         │ MCP tool calls (create/update components)
         ▼
┌─────────────────┐                ┌─────────────────┐
│   MCP-UI        │───WebSocket───►│     Client      │
│   Server        │  (mutations)   │                 │
└─────────────────┘                └─────────────────┘
```

**Data flow:**
- LangGraph stream → chat messages (consumer handles separately)
- MCP tools → component updates → WebSocket → client

```tsx
// Client setup - same as Pattern 2
<McpUiProvider
  serverUrl="ws://localhost:3001"
  onAction={(action) => sendToLangGraph(action)}
>
  <RemoteRenderer uri="/ui" />
</McpUiProvider>
```

**No special LangGraph integration needed.** Consumer uses LangGraph's `useStream` for chat, our library for components. They're independent.

**Future:** If direct streaming to components becomes needed, can add Option B (LangGraph stream → components) without breaking changes.

---

## Server-Side Patterns

**Note:** This section documents server behavior for context. The client library doesn't implement this.

### URI-Based Element Identity

Elements are identified by URI. The MCP-UI server creates the URI on initial creation.

```typescript
// Initial create - server generates URI, returns it
const result = await createDataTable({ rows: [] });
// result.uri = "/ui/elements/abc123"

// Update - caller must provide the URI from initial create
await createDataTable({ uri: "/ui/elements/abc123", rows: [{ name: "Alice" }] });
```

**Key points:**

- Server generates URI on first create (caller doesn't specify)
- Subsequent updates require the URI from the initial response
- Same tool for create and update (idempotent)
- Orchestrator must track URIs to update components later

**Implication for orchestrators:**
LangGraph/agents need to store returned URIs (e.g., in conversation state or tool context) to reference components for updates.

---

## Prop Injection (Compound Components)

Some Nimbus components use `React.cloneElement()` to inject props into children (e.g., FormField.Input injects `id`, `aria-describedby`, error state into its child input).

**The Problem:**
When the server renders `FormField.Input` with a child `TextInput`, the injected props must flow through Remote DOM serialization to reach the actual child component.

**The Solution:**
Components that use cloneElement need special handling:

```typescript
// FormField.Root reconstructs children inside its context
const FormFieldRootWrapper = (props) => {
  const { children, ...rest } = props;

  // Children must be re-rendered inside FormField.Root's context
  // so FormField.Input/Label/etc. can register with the context
  const reconstructed = children.map((child, index) => {
    const element = child.props.element; // Remote DOM element data
    return renderElement(element, index, componentMap);
  });

  return (
    <FormField.Root {...rest}>
      {reconstructed}
    </FormField.Root>
  );
};
```

**Components requiring this pattern:**
- `FormField.Root` - Children need context access for registration

---

## styleProps Handling

Nimbus components accept Chakra UI style props. These are serialized separately by Remote DOM.

```typescript
// Server sends props like:
{
  styleProps: { margin: "400", padding: "200" },
  variant: "solid",
  children: "Click me"
}

// Wrapper spreads styleProps onto component
const simple = (Component) => (props) => {
  const { styleProps, children, ...rest } = props;
  const merged = { ...rest, ...styleProps };

  return <Component {...merged}>{children}</Component>;
};
```

This is handled automatically in the wrapper factory.

---

## Form Data Extraction

When a button inside a form is clicked, extract form data and include in action:

```typescript
const ButtonWrapper = (props) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handlePress = () => {
    const formData: Record<string, string> = {};

    const form = buttonRef.current?.closest('form');
    if (form) {
      const inputs = form.querySelectorAll<HTMLInputElement>('input[name]');
      inputs.forEach((input) => {
        if (input.name) {
          formData[input.name] = input.value;
        }
      });
    }

    dispatchAction({
      type: 'button.press',
      elementId: props.id,
      payload: { formData },
    });
  };

  return <Button ref={buttonRef} onPress={handlePress} {...props} />;
};
```

**Form data is automatically included in button click actions.** The orchestrator receives the complete form state.

---

## Data Transformation

Some props need transformation from serialized format:

### JSON String Parsing

DataTable columns/rows are serialized as JSON strings:

```typescript
const DataTableWrapper = (props) => {
  const { columns, rows, ...rest } = props;

  // Parse JSON strings if needed
  const parsedColumns = typeof columns === 'string'
    ? JSON.parse(columns)
    : columns;
  const parsedRows = typeof rows === 'string'
    ? JSON.parse(rows)
    : rows;

  // Transform accessor strings to functions
  const transformedColumns = parsedColumns.map((col) => ({
    ...col,
    accessor: typeof col.accessor === 'string'
      ? (row) => row[col.id]
      : col.accessor,
  }));

  return <DataTable columns={transformedColumns} rows={parsedRows} {...rest} />;
};
```

### Compound Value Construction

MoneyInput value needs reconstruction:

```typescript
const MoneyInputWrapper = (props) => {
  const { currencyCode, amount, currencies, ...rest } = props;

  const parsedCurrencies = typeof currencies === 'string'
    ? JSON.parse(currencies)
    : currencies;

  const value = {
    currencyCode: currencyCode || 'USD',
    amount: amount || '',
  };

  return <MoneyInput value={value} currencies={parsedCurrencies} {...rest} />;
};
```

**These transformations are internal to the library.** Consumers don't need to handle them.

---

## Exported Types

Types consumers can import:

```typescript
// Main exports
export { McpUiProvider, RemoteRenderer, useMcpUi } from './core';

// Types
export type {
  McpUiProviderProps,
  RemoteRendererProps,
  RemoteDomContent,
  Action,
  McpUiError,
  ConnectionState,
} from './types';

// Hook return type for useMcpUi
export interface McpUiContextValue {
  connectionState: ConnectionState;
  error: McpUiError | null;
  dispatchAction: (action: Action) => void;
  syncToServer: (action: Action) => void;
}
```

---

## Implementation Order

1. **Extract core from POC** - Provider, Renderer, connection hooks
2. **Build registry** - Convert wrappers to config with `requiresOrchestrator`
3. **Test with existing POC server** - Ensure feature parity
4. **Package and publish** - Single `@mcp-ui/nimbus` package
5. **Document LangChain pattern** - Examples, not code

---

## What We're NOT Doing

- ❌ Multiple packages (premature split)
- ❌ Typed action discriminated unions (over-engineering)
- ❌ LangChain adapter package (just docs)
- ❌ Consumer-side event routing logic (library handles it)

---

## Open Questions

1. **Versioning** - How to handle Nimbus version compatibility?
2. **Server package** - Separate effort or include here?
3. **Testing** - How to test without running server?
