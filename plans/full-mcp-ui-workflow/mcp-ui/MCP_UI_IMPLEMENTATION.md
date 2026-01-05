# MCP-UI Remote DOM Reference Architecture for Nimbus Design System

## Overview

This document describes the **Remote DOM architecture** for using Nimbus
components in **any user-facing prompt-based LLM workflow**. It presents
patterns and approaches for generating UIs in LLM responses using the MCP-UI
technology.

**Important Distinction**:

- **MCP-UI** (the technology) = Remote DOM pattern for generating UIs in LLM
  responses
- **MCP** (Model Context Protocol) = One specific protocol that can use MCP-UI

**Universal Applicability**: MCP-UI works with any LLM application that needs to
generate visual responses, including:

- Custom chatbot applications
- Conversational AI interfaces (LangChain, AutoGPT, etc.)
- Customer support automation
- AI agent workflows
- Any prompt-based LLM system requiring UI generation

**Critical Concept**: This is **NOT traditional SSR**. The MCP-UI server creates
**virtual DOM descriptions** (like HTML) using custom element names
(`nimbus-button`, `nimbus-menu`, etc.). The client application - which already
has Nimbus installed - maps these custom elements to real Nimbus components.

**Universal Component Library Pattern**: This Remote DOM approach is necessary
for **ANY component library** (Material UI, Ant Design, Chakra UI, etc.) that
wants to enable LLM-generated UIs. The challenge is universal: how to render
design system components in LLM responses without:

- Duplicating component code between server and client
- Bloating server bundles with full component libraries
- Breaking design system consistency
- Losing type safety and accessibility features

**Why Nimbus is Well-Suited**: Nimbus's architecture makes it particularly
effective for this pattern:

- **Composable component architecture**: Compound components (Menu.Root,
  Menu.Trigger, Menu.Item) map naturally to hierarchical virtual DOM
  descriptions, enabling flexible composition in LLM-generated UIs
- **Robust styling system**: Chakra UI v3 recipes with variants, sizes, and
  slot-based styling provide multiple styling strategies adaptable to different
  deployment contexts (Remote DOM, HTML Snippets, Hosted Widgets)
- **Design token foundation**: Centralized semantic tokens enable consistent
  theming across server-generated and client-rendered UIs with context-aware
  customization
- **React Aria integration**: Built-in accessibility patterns translate cleanly
  to virtual DOM descriptions with proper ARIA attributes and keyboard
  navigation support
- **Type-safe component API**: TypeScript definitions for custom elements
  (`nimbus-button`, `nimbus-menu-root`) provide compile-time safety for
  server-side element creation
- **Virtual element architecture**: Chakra UI v3's slot recipe system already
  uses virtual element patterns internally, aligning naturally with Remote DOM
  concepts

**Technical Approach by Strategy**:

1. **Remote DOM (Internal Apps)**: Client-side mapping only - no server-side
   rendering or hydration needed. The MCP-UI server creates virtual DOM
   descriptions, client maps to installed Nimbus components.

2. **HTML Snippet Rendering (External Low-Complexity)**: Server-side rendering
   to static HTML without hydration. Used when external applications don't have
   Nimbus installed and components are simple (badges, alerts, basic layouts).

3. **Hosted Widget (External High-Complexity)**: Full server-side rendering with
   hydration and CSS-in-JS runtime. Used for complex interactive components
   (data tables, rich text editors) in external applications. Includes complete
   React + Nimbus + Chakra UI bundle with client-side hydration.

**Deployment Strategy**:

- **Node.js runtime**: Standard server deployment for controlled applications
  - Full Node.js API access
  - Straightforward build process
  - Ideal for internal tools and merchant platforms

- **Edge runtime**: Optimization for external sites and uncontrolled
  environments
  - Edge runtime constraints (Cloudflare, Vercel)
  - Bundle size optimization
  - Alternative strategies (HTML snippets, hosted widgets)

**Key Architectural Benefits**:

- ✅ **Minimal server payload**: ~30 KB (element creation logic only)
- ✅ **No component duplication**: Client already has Nimbus
- ✅ **No CSS extraction**: Client already has Nimbus styles
- ✅ **Flexible deployment**: Works in Node.js or edge environments

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    LLM Application (Chatbot/AI Agent)                   │
│                                                                         │
│  ┌──────────────┐     ┌──────────────────┐     ┌──────────────────┐  │
│  │ User Query   │────▶│ LLM Processing   │────▶│ Response         │  │
│  │              │     │                  │     │ Generation       │  │
│  └──────────────┘     └──────────────────┘     └────────┬─────────┘  │
│                                                          │             │
└──────────────────────────────────────────────────────────┼─────────────┘
                                                           │
                                                           │ Needs UI Response
                                                           ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                   MCP-UI Server (Integration Component)                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────┐     ┌──────────────┐     ┌────────────────────┐    │
│  │ Auth Layer   │────▶│ Context      │────▶│ MCP Tool Handler   │    │
│  │ OAuth2/JWT   │     │ Extraction   │     │ (UI Generation)    │    │
│  └──────┬───────┘     └──────────────┘     └─────────┬──────────┘    │
│         │                                             │                │
│         │ Validates                                   ▼                │
│         │                                  ┌────────────────────┐     │
│  ┌──────┴────────┐                         │ Virtual DOM        │     │
│  │ Identity      │                         │ createElement()    │     │
│  │ Provider      │                         │ NimbusElements.*   │     │
│  └───────────────┘                         └─────────┬──────────┘     │
│                                                      │                │
└──────────────────────────────────────────────────────┼─────────────────┘
                                                       │
                                                       │ Returns Virtual DOM
                                                       │ JSON (~30 KB)
                                                       ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         Client Application                              │
│                    (Merchant Center, Custom UI, etc.)                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌────────────────┐     ┌────────────────┐     ┌──────────────────┐  │
│  │ LLM Response   │────▶│ Context        │────▶│ Virtual DOM      │  │
│  │ with UI        │     │ Application    │     │ Mapper           │  │
│  └────────────────┘     │ (Theme/Locale) │     │ mapVirtualElement│  │
│                         └────────────────┘     └────────┬─────────┘  │
│                                                          │             │
│                                                          ▼             │
│                         ┌────────────────────────────────────────┐    │
│                         │ Element Registry                       │    │
│                         │ 'nimbus-button' → Button               │    │
│                         │ 'nimbus-menu-root' → Menu.Root         │    │
│                         └──────────────────┬─────────────────────┘    │
│                                            │                           │
│                                            ▼                           │
│                         ┌────────────────────────────────┐            │
│                         │ Nimbus Components              │            │
│                         │ (Already Installed)            │            │
│                         └──────────────────┬─────────────┘            │
│                                            │                           │
│                                            ▼                           │
│                                     [Rendered UI]                      │
└─────────────────────────────────────────────────────────────────────────┘

Integration Pattern:
  • MCP-UI Server integrates into ANY LLM application workflow (not just MCP protocol)
  • Works with: Custom chatbots, LangChain, AutoGPT, conversational AI, MCP tools
  • LLM applications call MCP-UI server to generate UI responses
  • Virtual DOM descriptions flow through LLM response to client
  • Client application already has Nimbus installed (no component duplication)
  • Same MCP-UI server supports multiple LLM applications simultaneously

Key Components:
  • Authentication: OAuth2/JWT validation with identity provider integration
  • Context: Organization/project/user metadata for theming and multi-tenancy
  • Virtual DOM: Serializable element descriptions (~30 KB payload)
  • Element Registry: Bidirectional mapping of custom names to components
```

---

## Core Architectural Concepts

### Remote DOM Pattern

The Remote DOM pattern separates UI description from UI implementation, similar
to how HTML works in web browsers.

**Traditional HTML Model**:

```html
<!-- Browser provides the button implementation -->
<button onclick="alert('hi')">Click me</button>
```

**Remote DOM Model**:

```typescript
// Server creates virtual DOM description
const button = document.createElement("nimbus-button");
button.setAttribute("variant", "solid");
button.textContent = "Click me";

// Client maps custom element → Nimbus component
// 'nimbus-button' → <Button variant="solid">Click me</Button>
```

**Key Principle**: The server describes UI structure; the client provides the
actual implementation. This decoupling is the foundation of the architecture.

### Data Flow

The architecture follows a simple flow from server to client:

1. **Server**: MCP tool creates virtual DOM using custom element names
2. **Transport**: Virtual DOM transmitted as serialized JSON (~30 KB typical)
3. **Client**: Maps custom elements to actual Nimbus components
4. **Render**: Client renders using its existing Nimbus installation

**Bundle Size Comparison**:

- Traditional approach: 400-600 KB (full component bundle)
- Remote DOM approach: ~60 KB (30 KB server logic + 30 KB client mapping)
- Savings: ~85% reduction in bundle size

### Architecture Requirements

**Server-Side Components**:

- **Element creation utilities**: Functions for creating virtual DOM
  descriptions
- **Type system**: Serializable prop definitions for all Nimbus components
- **Runtime target**: Node.js or edge runtime compatibility

**Client-Side Components**:

- **Element registry**: Mapping from custom element names to Nimbus components
- **Virtual DOM mapper**: Converts virtual DOM descriptions to React elements
- **Integration layer**: Connects MCP responses to React rendering

**Supporting Infrastructure**:

- **Build configuration**: Appropriate bundling for target runtime
- **Type safety**: End-to-end TypeScript coverage
- **Testing**: Integration tests validating server-to-client flow

---

## Architectural Advantages

### Comparison with Traditional SSR

The Remote DOM approach avoids many complexities inherent in traditional
server-side rendering:

**Traditional SSR Challenges**:

- CSS extraction and serialization (`@emotion/server`)
- Hydration coordination between server and client
- Large bundle sizes (React + Chakra + Nimbus = 400-600 KB)
- Edge runtime limitations with CSS-in-JS
- Complex consumer integration

**Remote DOM Benefits**:

- **No CSS processing**: Client already has styles
- **No hydration**: Client renders from scratch
- **Minimal bundle**: Element creation only (~30 KB)
- **Runtime flexibility**: Works in Node.js or edge environments
- **Simple integration**: Element mapping on client side

### Deployment Architecture

The architecture supports progressive deployment from prototype to production:

**Prototyping Phase**:

- Simple Node.js API server
- Rapid iteration and validation
- Minimal infrastructure

**Production Deployment**:

- Kubernetes containerized deployment
- Horizontal scaling and orchestration
- Service mesh integration
- Health checks and monitoring

**Edge Optimization** (when needed):

- Bundle size optimization
- Global distribution
- Cold start minimization

**Progressive Strategy**: Start with Node.js API for prototyping, containerize
for production Kubernetes deployment, optimize for edge if global distribution
requirements emerge.

---

## Production Architecture Patterns

### Authentication & Authorization

Production deployments require secure authentication mechanisms for MCP server
access.

**OAuth2/JWT Pattern**:

- OAuth2 flows for user authentication
- JWT tokens for stateless authorization
- Integration with identity providers (Ory Kratos, commercetools Identity)
- Token validation on each request

**Authentication Flow**:

```typescript
// Server validates incoming requests
server.setRequestHandler(async (request, context) => {
  // Extract and validate JWT from request headers
  const token = extractToken(request.headers.authorization);
  const claims = await validateToken(token);

  // Use claims for authorization and context
  const userContext = {
    userId: claims.sub,
    organizationId: claims.org,
    permissions: claims.permissions,
  };

  // Process request with authenticated context
  return handleRequest(request, userContext);
});
```

**Key Considerations**:

- Token validation must be lightweight for edge compatibility
- Consider token caching strategies for performance
- Handle token refresh flows appropriately
- Integrate with existing identity infrastructure

### Context Propagation

MCP servers need to pass contextual information to downstream services for
theming, multi-tenancy, and personalization.

**Context Types**:

- **Organization context**: Company/organization ID for multi-tenant theming
- **Project context**: Project-specific configurations
- **User context**: User preferences and permissions
- **Theme context**: Color schemes, branding, customizations

**Context Passing Pattern**:

```typescript
// Server includes context in virtual DOM metadata
const element = createElement(
  NimbusElements.ALERT_ROOT,
  {
    status: "info",
    children: "Welcome message",
  },
  {
    // Context metadata (not rendered, used by client)
    __context: {
      organizationId: userContext.organizationId,
      theme: userContext.theme,
      locale: userContext.locale,
    },
  }
);
```

**Client Context Consumption Pattern**:

```typescript
// Client extracts and applies context
export const MCPToolResult = ({ mcpResponse }) => {
  const virtualElement = mcpResponse.content[0].resource;
  const context = virtualElement.__context;

  // Apply organization-specific theming
  const theme = getThemeForOrganization(context.organizationId);

  return (
    <ThemeProvider theme={theme}>
      {mapVirtualElement(virtualElement)}
    </ThemeProvider>
  );
};
```

**Context Propagation Strategies**:

- Embed context in virtual DOM metadata
- Use HTTP headers for service-to-service communication
- Cache context at appropriate layers
- Validate context authorization at boundaries

---

## Implementation Patterns

### Element Mapping Registry

The element registry creates a bidirectional mapping between custom element
names and Nimbus components.

**Client-Side Registry Pattern**:

```typescript
// Element registry maps custom names to actual components
import { Button, Menu, Select, Dialog } from "@commercetools/nimbus";

export const nimbusElementRegistry = {
  "nimbus-button": Button,
  "nimbus-menu": Menu,
  "nimbus-menu-root": Menu.Root,
  "nimbus-menu-trigger": Menu.Trigger,
  "nimbus-menu-content": Menu.Content,
  "nimbus-select": Select,
  "nimbus-dialog": Dialog,
  // Additional components as needed
};
```

**Server-Side Element Creation Pattern**:

```typescript
// Server creates virtual DOM descriptions
export function createNimbusElement(type: string, props: any, children?: any) {
  return {
    type, // Custom element name: 'nimbus-button'
    props, // Serializable props: { variant: 'solid' }
    children, // Nested elements or text content
  };
}
```

### Props Serialization

Virtual DOM requires JSON-serializable props, which imposes constraints on the
prop types.

**Serializable Type Definition**:

```typescript
type SerializableProp =
  | string
  | number
  | boolean
  | null
  | SerializableProp[]
  | { [key: string]: SerializableProp };

// Component props restricted to serializable types
export interface NimbusButtonProps {
  variant?: "solid" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isDisabled?: boolean;
  children?: string;
  // Functions, refs, and React nodes are not serializable
}
```

**Design Consideration**: This constraint means event handlers must be
registered on the client side after rendering, not passed through the virtual
DOM.

### Build Configuration

The build configuration depends on the target runtime and deployment strategy.

**Node.js Target**:

```typescript
// Standard build for Node.js environments
export default defineConfig({
  build: {
    lib: {
      entry: "./src/index.ts",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "js" : "cjs"}`,
    },
    target: "node18",
  },
});
```

**Edge Runtime Target**:

```typescript
// Optimized build for edge environments
export default defineConfig({
  build: {
    lib: {
      entry: "./src/entry-edge.ts",
      formats: ["es"],
      fileName: () => "nimbus-mcp-server.js",
    },
    rollupOptions: {
      external: [], // Bundle all dependencies
    },
    minify: "terser",
    target: "es2020", // Modern JS for edge runtimes
  },
});
```

---

## Package Architecture

### Three-Package Strategy

The architecture separates concerns across three packages to maintain
flexibility and minimize impact on existing Nimbus consumers.

**Core Package: `@commercetools/nimbus`**

- Existing component library
- No modifications required
- Remains independent of MCP concerns

**Client Package: `@commercetools/nimbus-mcp-ui-client`**

- Element registry mapping custom names to components
- Virtual DOM to React element conversion
- Client-side integration utilities
- Installed in applications that consume MCP responses

**Server Package: `@commercetools/nimbus-mcp-ui-server`**

- Virtual DOM element creation utilities
- Serializable type definitions
- Runtime-appropriate bundling
- Deployed alongside MCP tools

**Architectural Benefits**:

- Clean separation of concerns
- Optional adoption (doesn't affect existing Nimbus users)
- Independent versioning and release cycles
- Minimal cross-package dependencies

---

## Implementation Reference

### Server Package Structure

The server package provides utilities for creating virtual DOM descriptions.
Here's a reference implementation structure:

**Directory Organization**:

```bash
packages/nimbus-mcp-server/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── index.ts           # Main entry point
│   ├── element.ts         # Element creation utilities
│   ├── types.ts           # Serializable type definitions
│   └── registry.ts        # Element name constants
└── README.md
```

**Element Creation API Pattern**:

```typescript
// Element creation utilities
export interface VirtualElement {
  type: string;
  props: Record<string, SerializableProp>;
  children?: VirtualElement[] | string;
}

type SerializableProp =
  | string
  | number
  | boolean
  | null
  | SerializableProp[]
  | { [key: string]: SerializableProp };

export function createElement(
  type: string,
  props: Record<string, SerializableProp> = {},
  ...children: (VirtualElement | string)[]
): VirtualElement {
  return {
    type,
    props,
    children:
      children.length === 0
        ? undefined
        : children.length === 1
          ? children[0]
          : children,
  };
}
```

**Element Name Registry Pattern**:

```typescript
// Element name constants
export const NimbusElements = {
  BUTTON: "nimbus-button",
  MENU: "nimbus-menu",
  MENU_ROOT: "nimbus-menu-root",
  MENU_TRIGGER: "nimbus-menu-trigger",
  MENU_CONTENT: "nimbus-menu-content",
  MENU_ITEM: "nimbus-menu-item",
  SELECT: "nimbus-select",
  DIALOG: "nimbus-dialog",
  // Additional components as needed
} as const;
```

**Package Configuration Pattern**:

```json
{
  "name": "@commercetools/nimbus-mcp-ui-server",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "files": ["dist", "README.md"],
  "keywords": ["nimbus", "mcp", "remote-dom"],
  "sideEffects": false
}
```

### Client Package Structure

The client package handles mapping virtual DOM descriptions to React components.

**Directory Organization**:

```bash
packages/nimbus-mcp-client/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts           # Main entry point
│   ├── registry.ts        # Element registry
│   ├── mapper.ts          # Virtual DOM → React mapping
│   └── types.ts           # Type definitions
└── README.md
```

**Element Registry Pattern**:

```typescript
// Element registry mapping
import * as Nimbus from "@commercetools/nimbus";
import type { ComponentType } from "react";

export const elementRegistry: Record<string, ComponentType<any>> = {
  "nimbus-button": Nimbus.Button,
  "nimbus-badge": Nimbus.Badge,
  "nimbus-menu": Nimbus.Menu,
  "nimbus-menu-root": Nimbus.Menu.Root,
  "nimbus-menu-trigger": Nimbus.Menu.Trigger,
  "nimbus-menu-content": Nimbus.Menu.Content,
  "nimbus-menu-item": Nimbus.Menu.Item,
  "nimbus-select": Nimbus.Select,
  "nimbus-select-root": Nimbus.Select.Root,
  "nimbus-select-trigger": Nimbus.Select.Trigger,
  "nimbus-select-option": Nimbus.Select.Option,
  "nimbus-dialog": Nimbus.Dialog,
  "nimbus-dialog-root": Nimbus.Dialog.Root,
  "nimbus-dialog-trigger": Nimbus.Dialog.Trigger,
  // Additional mappings as needed
};
```

**Virtual DOM Mapper Pattern**:

```typescript
// Virtual DOM to React element conversion
import { createElement } from "react";
import { elementRegistry } from "./registry";
import type { VirtualElement } from "@commercetools/nimbus-mcp-ui-server";

export function mapVirtualElement(
  virtualEl: VirtualElement
): React.ReactElement {
  const Component = elementRegistry[virtualEl.type];

  if (!Component) {
    throw new Error(`Unknown Nimbus element: ${virtualEl.type}`);
  }

  const children = Array.isArray(virtualEl.children)
    ? virtualEl.children.map((child) =>
        typeof child === "string" ? child : mapVirtualElement(child)
      )
    : virtualEl.children;

  return createElement(Component, virtualEl.props, children);
}
```

**Public API Pattern**:

```typescript
// Main exports for client package
export { elementRegistry } from "./registry";
export { mapVirtualElement } from "./mapper";
export type { VirtualElement } from "@commercetools/nimbus-mcp-ui-server";
```

**Package Dependencies Pattern**:

```json
{
  "name": "@commercetools/nimbus-mcp-ui-client",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "peerDependencies": {
    "@commercetools/nimbus": "workspace:*",
    "react": "^18.0.0"
  },
  "dependencies": {
    "@commercetools/nimbus-mcp-ui-server": "workspace:*"
  }
}
```

---

## Testing Patterns

### Integration Testing Strategy

Integration tests validate the complete flow from server element creation to
client rendering.

**Basic Integration Test Pattern**:

```typescript
describe('Remote DOM Integration', () => {
  it('creates and renders simple components', async () => {
    // Server: Create virtual DOM
    const element = createElement('nimbus-button', {
      variant: 'solid',
      children: 'Click me'
    });

    // Client: Map to React component
    const Component = mapVirtualElement(element);
    const { getByRole } = render(<Component />);

    expect(getByRole('button')).toHaveTextContent('Click me');
  });

  it('handles compound component structure', async () => {
    // Server: Create nested structure
    const menu = createElement('nimbus-menu-root', {}, [
      createElement('nimbus-menu-trigger', { children: 'Open' }),
      createElement('nimbus-menu-content', {}, [
        createElement('nimbus-menu-item', { children: 'Edit' })
      ])
    ]);

    // Client: Render full structure
    const Component = mapVirtualElement(menu);
    // Validation logic
  });

  it('handles serializable props correctly', async () => {
    const element = createElement('nimbus-button', {
      variant: 'solid',
      size: 'md',
      isDisabled: false,
    });

    // Verify props are passed through correctly
  });
});
```

**Test Coverage Considerations**:

- Simple and compound component rendering
- Props serialization and forwarding
- Nested children handling
- Error cases (unknown elements, invalid props)
- Type safety across server-client boundary

---

## Usage Patterns

### Server-Side Usage

MCP tool authors create virtual DOM descriptions using the server package.

**Installation**:

```bash
npm install @commercetools/nimbus-mcp-ui-server
```

**Basic Element Creation**:

```typescript
import {
  createElement,
  NimbusElements,
} from "@commercetools/nimbus-mcp-ui-server";

// Using element name constants
const button = createElement(NimbusElements.BUTTON, {
  variant: "solid",
  children: "Click me",
});

// Compound components
const alert = createElement(
  NimbusElements.ALERT_ROOT,
  {
    status: "info",
  },
  [
    createElement(NimbusElements.ALERT_TITLE, {
      children: "Important",
    }),
    createElement(NimbusElements.ALERT_DESCRIPTION, {
      children: "Task completed successfully",
    }),
  ]
);
```

**MCP Tool Integration Pattern**:

```typescript
import {
  createElement,
  NimbusElements,
} from "@commercetools/nimbus-mcp-ui-server";

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "show-status") {
    return {
      content: [
        {
          type: "resource",
          resource: createElement(
            NimbusElements.ALERT_ROOT,
            {
              status: "info",
            },
            [
              createElement(NimbusElements.ALERT_TITLE, {
                children: "Status Update",
              }),
              createElement(NimbusElements.ALERT_DESCRIPTION, {
                children: "Operation completed",
              }),
            ]
          ),
        },
      ],
    };
  }
});
```

**Key Characteristics**:

- Element creation functions are type-safe
- Props are validated at compile time
- Returns serializable descriptions (not React components)
- No rendering occurs on server

### Client-Side Usage

Client applications integrate the mapping layer to render virtual DOM
descriptions.

**Installation**:

```bash
npm install @commercetools/nimbus-mcp-ui-client
```

**Provider Setup Pattern**:

```typescript
import { mapVirtualElement } from '@commercetools/nimbus-mcp-ui-client';
import { NimbusProvider } from '@commercetools/nimbus';

export const AppProviders = ({ children }) => (
  <NimbusProvider>
    {children}
  </NimbusProvider>
);
```

**Rendering Virtual DOM Pattern**:

```typescript
import { mapVirtualElement } from "@commercetools/nimbus-mcp-ui-client";

export const MCPToolResult = ({ mcpResponse }) => {
  // mcpResponse contains virtual DOM from server
  const element = mapVirtualElement(mcpResponse.content[0].resource);

  return element;
};
```

**Direct Component Access Pattern**:

```typescript
import { elementRegistry } from '@commercetools/nimbus-mcp-ui-client';
import { createElement } from 'react';

// Access specific component from registry
const Button = elementRegistry['nimbus-button'];

// Use directly in your UI
export const CustomUI = () => (
  <Button variant="solid">
    Custom Button
  </Button>
);
```

---

## Implementation Success Factors

### Technical Validation

**End-to-End Type Safety**:

- Virtual DOM descriptions are type-checked on server
- Element registry provides compile-time validation
- Props flow correctly from server to client
- TypeScript catches mismatches early

**Bundle Size Management**:

- Server bundle minimal (~30 KB)
- Client mapping layer lightweight (~30 KB)
- No component code duplication
- Efficient network transfer

**Production Readiness**:

- Authentication/authorization integrated (OAuth2/JWT)
- Container-ready for Kubernetes deployment
- Context propagation for multi-tenancy
- Health checks and monitoring hooks
- Graceful error handling and fallbacks

**Integration Testing**:

- Server element creation validates correctly
- Client mapping produces expected React components
- Props and children handled accurately
- Authentication flows tested
- Context propagation verified
- Error cases gracefully managed

### Developer Experience

**Familiar API Surface**:

- Element creation mirrors Nimbus component API
- TypeScript autocomplete guides usage
- Error messages provide actionable feedback
- Documentation with working examples

**Minimal Integration Overhead**:

- Simple installation process
- Straightforward setup patterns
- Progressive deployment path (prototype → production → edge)
- Clear documentation path
- Incremental adoption possible

---

## Deployment-Specific Strategies

The architecture requires different rendering strategies based on the deployment
environment and component complexity.

### Strategy Selection Matrix

```
                     Internal Applications          External Applications
                     (Nimbus Installed)            (No Nimbus Guarantee)
                     ─────────────────────         ─────────────────────

Low-Complexity       Remote DOM                    HTML Snippet Rendering
Components           (Virtual DOM Mapping)         (Self-Contained HTML)
(Button, Badge,
Alert, Text)         ~30 KB per request            ~10-30 KB per component

High-Complexity      Remote DOM                    Hosted Widget
Components           (Virtual DOM Mapping)         (Edge CDN + iframe)
(DataTable,
RichTextInput,       ~30 KB per request            ~400-600 KB (loaded once)
ComboBox)
```

### Remote DOM Strategy

**For internal applications with Nimbus installed** (merchant platforms,
controlled environments).

**Characteristics**:

- Virtual DOM descriptions mapped to existing Nimbus components
- Client already has full component library
- Minimal payload (~30 KB)
- Full theming and interactivity

**Use When**:

- Client application has Nimbus installed
- Full control over client environment
- Need complete Nimbus theming system

### HTML Snippet Rendering Strategy

**Required for external applications - low-complexity components**
(public-facing sites, third-party integrations).

**Characteristics**:

- Components rendered to self-contained HTML with inline CSS
- No client dependencies required
- Suitable for simple, non-interactive components
- Bundle size: ~10-30 KB per component
- Server-side rendering with Nimbus styles extracted

**Use When**:

- External applications without Nimbus
- Simple components (Button, Badge, Alert, Text)
- Limited interactivity needs
- Quick embedding without dependencies

**Tradeoffs**:

- Limited to static or simple interactive components
- No access to dynamic Nimbus theming
- Larger payload than Remote DOM
- Each component includes its own CSS

### Hosted Widget Strategy

**Required for external applications - high-complexity components**
(public-facing sites needing full component functionality).

**Characteristics**:

- Full Nimbus components hosted on edge CDN
- Embedded via iframe or web component
- Complete theming and interactivity
- Bundle size: ~400-600 KB (loaded once, cached)
- Supports complex state management and interactions

**Use When**:

- External applications without Nimbus
- Complex components (DataTable, RichTextInput, ComboBox)
- Need full Nimbus functionality and theming
- Interactive features required (sorting, filtering, editing)

**Tradeoffs**:

- Requires widget hosting infrastructure
- Cross-origin communication overhead
- More complex initial integration
- Higher resource usage (mitigated by caching)

---

## Summary

The Remote DOM architecture enables efficient UI composition for **any LLM
application** by separating description from implementation. The pattern
leverages custom elements as an interchange format, maintaining type safety
while minimizing bundle size.

**Universal Applicability**: Despite the name "MCP-UI", this technology works
with any prompt-based LLM workflow - custom chatbots, LangChain, AutoGPT,
conversational AI, and yes, Model Context Protocol implementations. The
architecture is protocol-agnostic and integrates with any LLM application
requiring visual UI generation.

**Core Principle**: Servers describe structure using virtual DOM; clients
provide implementation using their existing Nimbus installation. This alignment
with the Remote DOM philosophy - describing rather than rendering - keeps the
architecture simple while delivering rich UI capabilities.

**Production Architecture**: The system supports progressive deployment from
prototype to production, with authentication/authorization integration
(OAuth2/JWT), context propagation for multi-tenancy, and container-ready
deployment for Kubernetes. The architecture scales from simple Node.js APIs to
global edge distribution.

**Deployment Flexibility**: The architecture supports three deployment-specific
strategies:

1. **Remote DOM** for internal applications with Nimbus installed (optimal
   efficiency)
2. **HTML Snippet Rendering** for external applications with low-complexity
   components
3. **Hosted Widget** for external applications with high-complexity components

Start with Node.js API for prototyping, containerize for production Kubernetes
deployment, and optimize for edge when global distribution requirements emerge.
Choose rendering strategy based on deployment environment and component
complexity.
