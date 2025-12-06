# MCP-UI Architecture Options Considered

## Context

The goal is to enable **any user-facing prompt-based LLM workflow** to render consistent, branded UIs using the Nimbus design system. This includes chatbots, AI agents, conversational interfaces, customer support assistants, and any application where an LLM needs to generate visual responses.

**Important Distinction**:
- **MCP-UI** (the technology) = Remote DOM pattern for generating UIs in LLM responses
- **MCP** (Model Context Protocol) = One specific protocol that can use MCP-UI

MCP-UI is **not limited to MCP protocol implementations**. It can be integrated into:
- Standalone chatbot applications
- Custom conversational AI interfaces
- AI agent workflows (LangChain, AutoGPT, etc.)
- Customer support automation
- Any LLM application that needs to generate visual UI responses

The architecture works across both internal applications (Merchant Center, controlled environments) and external applications (public-facing sites, third-party integrations).

## Key Requirements

- **Design System Consistency**: All UIs must use Nimbus components and theming
- **Authentication**: OAuth2/JWT integration with identity providers (Ory Kratos, commercetools Identity)
- **Multi-tenancy**: Context propagation for organization/project-specific theming
- **Deployment Flexibility**: Support both Kubernetes containerized deployment and edge optimization
- **Internal + External**: Handle both internal apps (with Nimbus) and external apps (without Nimbus)

---

## Option 1: Unified Workflow vs Separate Workflows

### Decision: Should there be separate workflows for internal and external applications?

#### Option 1A: Single Unified Workflow

**Architecture**: One MCP-UI service that detects deployment context and adapts rendering strategy.

```
                    ┌─────────────────┐
                    │   MCP-UI        │
                    │   Service       │
                    └────────┬────────┘
                             │
                    ┌────────┴────────┐
                    │   Detect        │
                    │   Context       │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
       Internal Apps    External Low   External High
       (Remote DOM)     (HTML Snippet)  (Hosted Widget)
```

**Pros**:
- Single service to maintain and deploy
- Consistent authentication and context handling
- Unified monitoring and logging
- Simpler infrastructure (one K8s deployment)
- Shared code for element creation and validation

**Cons**:
- More complex routing logic
- Mixed concerns (DOM generation, HTML rendering, widget hosting)
- Potential performance impact from context detection
- Harder to optimize each strategy independently

#### Option 1B: Separate Workflows

**Architecture**: Three distinct services for each rendering strategy.

```
MCP-UI-Remote-DOM    ──▶  Internal Apps
MCP-UI-HTML          ──▶  External Low-Complexity
MCP-UI-Widget-Host   ──▶  External High-Complexity
```

**Pros**:
- Clear separation of concerns
- Independent optimization per use case
- Simpler individual services
- Can scale each service independently
- Different deployment strategies per service

**Cons**:
- Three services to maintain
- Duplicated authentication/context logic
- More complex infrastructure management
- Higher operational overhead
- Potential consistency issues between services

#### Decision: Unified Workflow with Strategy Pattern

**Rationale**:
1. **Shared Infrastructure**: Authentication, context propagation, and element validation are identical across all strategies
2. **Simplified Operations**: Single service means one K8s deployment, one monitoring setup, one authentication integration
3. **Cost Efficiency**: Shared code reduces maintenance burden (critical for long-term sustainability)
4. **Strategy Pattern**: Internal complexity manageable with strategy pattern for rendering logic
5. **Future Flexibility**: Easier to add new rendering strategies without new services

**Implementation Pattern**:
```typescript
// Single service with strategy selection
server.setRequestHandler(async (request, context) => {
  const strategy = selectStrategy(context.targetEnvironment, context.componentComplexity);

  switch(strategy) {
    case 'remote-dom':
      return renderRemoteDOM(context);
    case 'html-snippet':
      return renderHTMLSnippet(context);
    case 'hosted-widget':
      return renderHostedWidget(context);
  }
});
```

---

## Option 2: Service Architecture Selection

### Decision: Which architectural approach best fits the use case?

#### Option 2A: Custom DSL for Component Templating

**Architecture**: Create a domain-specific language (DSL) for describing Nimbus UIs.

**Example DSL**:
```yaml
component: alert
properties:
  status: info
  variant: solid
children:
  - component: alert-title
    content: "Important Message"
  - component: alert-description
    content: "Operation completed successfully"
```

**Pros**:
- Complete control over syntax and semantics
- Can optimize specifically for Nimbus components
- No external dependencies or protocol conformance
- Potential for visual DSL builder tools

**Cons**:
- **Reinventing the wheel**: Solving problems already solved by existing standards
- No ecosystem support or tooling
- Custom parser/validator maintenance burden
- Learning curve for developers (non-standard syntax)
- No TypeScript integration or type safety
- Harder to extend as Nimbus evolves
- Limited interoperability with other tools

**Why Not Chosen**: Creates unnecessary maintenance burden and lacks the ecosystem benefits of standard protocols. Every feature (validation, type checking, tooling) must be built from scratch.

#### Option 2B: AG-UI Protocol Implementation

**Architecture**: Implement a service conforming to the AG-UI protocol (https://docs.ag-ui.com/introduction).

**Example AG-UI**:
```json
{
  "type": "container",
  "layout": "vertical",
  "children": [
    {
      "type": "text",
      "content": "Important Message",
      "style": "heading"
    },
    {
      "type": "button",
      "label": "Confirm",
      "action": "submit"
    }
  ]
}
```

**Pros**:
- Established protocol with specification
- Designed specifically for AI-generated UIs
- Some ecosystem momentum
- Clear separation between UI description and implementation

**Cons**:
- **Not MCP-compatible**: AG-UI is separate from Model Context Protocol ecosystem
- **Generic component model**: Doesn't map cleanly to Nimbus design system
- Abstract components vs Nimbus-specific components (impedance mismatch)
- Would require custom translation layer (AG-UI → Nimbus)
- Less TypeScript integration than MCP-UI
- **Community size**: Smaller ecosystem than MCP
- Still requires building all rendering strategies

**Why Not Chosen**: The generic component model creates friction with Nimbus. Converting abstract "container" and "text" components to specific Nimbus components (Card, Alert, Typography) requires a lossy translation layer. MCP-UI provides better alignment with our design system.

#### Option 2C: MCP-UI with Remote DOM Pattern

**Architecture**: Implement MCP-UI server using the Remote DOM pattern with direct Nimbus component mapping.

**Note**: Despite the name "MCP-UI", this approach works with **any LLM workflow** - not just Model Context Protocol implementations. The technology uses Remote DOM principles and can integrate with any chatbot, AI agent, or conversational interface.

**Example MCP-UI**:
```typescript
const element = createElement('nimbus-alert-root', {
  status: 'info',
  variant: 'solid'
}, [
  createElement('nimbus-alert-title', {
    children: 'Important Message'
  }),
  createElement('nimbus-alert-description', {
    children: 'Operation completed successfully'
  })
]);
```

**Pros**:
- **Universal LLM Integration**: Works with any prompt-based LLM workflow (MCP, LangChain, custom chatbots, etc.)
- **Direct Nimbus mapping**: Custom element names map 1:1 to Nimbus components
- **Type safety**: TypeScript definitions for all Nimbus props
- **Zero translation layer**: No impedance mismatch between protocol and design system
- Virtual DOM familiar to React developers
- Supports all three rendering strategies (Remote DOM, HTML, Widgets)
- **Protocol agnostic**: Not tied to any specific LLM framework or protocol
- Built-in support for LLM tool integration patterns
- **Minimal payload**: Only element descriptions, not full component code

**Cons**:
- Relatively newer approach (less mature than some alternatives)
- Requires MCP-UI library understanding
- Custom element name conventions to maintain

**Why Chosen**:
1. **Best Nimbus Alignment**: Direct component mapping without translation
2. **Universal Integration**: Works with any LLM application architecture (MCP, LangChain, custom)
3. **Type Safety**: Full TypeScript support reduces runtime errors
4. **Strategy Support**: Enables all three rendering strategies from single approach
5. **Protocol Freedom**: Not locked into specific LLM frameworks
6. **Developer Experience**: Familiar React/Virtual DOM patterns

---

## Option 3: Multi-Strategy Service Complexity

### Decision: Is supporting both internal and external use cases in one service too complex?

#### Complexity Analysis

**Shared Components (70% of codebase)**:
- Authentication/authorization (OAuth2/JWT)
- Context extraction (organization, project, user)
- Element validation and type checking
- Error handling and logging
- Health checks and monitoring
- Base element creation utilities

**Strategy-Specific Components (30% of codebase)**:
- Remote DOM serialization (~10% of code)
- HTML snippet rendering (~10% of code)
- Widget hosting coordination (~10% of code)

#### Architectural Patterns to Manage Complexity

**Strategy Pattern**:
```typescript
interface RenderStrategy {
  render(element: VirtualElement, context: RenderContext): Response;
  canHandle(context: RenderContext): boolean;
}

class RemoteDOMStrategy implements RenderStrategy { /* ... */ }
class HTMLSnippetStrategy implements RenderStrategy { /* ... */ }
class HostedWidgetStrategy implements RenderStrategy { /* ... */ }

class MCPUIService {
  private strategies: RenderStrategy[];

  async handleRequest(request: MCPRequest, context: Context) {
    const strategy = this.strategies.find(s => s.canHandle(context));
    return strategy.render(request.element, context);
  }
}
```

**Factory Pattern for Context Detection**:
```typescript
class StrategySelector {
  selectStrategy(targetEnv: Environment, complexity: Complexity): RenderStrategy {
    if (targetEnv === 'internal') {
      return new RemoteDOMStrategy();
    }

    if (complexity === 'low') {
      return new HTMLSnippetStrategy();
    }

    return new HostedWidgetStrategy();
  }
}
```

#### Decision: Unified Service is Manageable

**Rationale**:
1. **Shared Infrastructure**: 70% of code is identical across strategies
2. **Clear Boundaries**: Strategy pattern provides clean separation
3. **Testing**: Can test strategies in isolation, integration tests cover routing
4. **Deployment**: Single K8s deployment simpler than coordinating three services
5. **Evolution**: New strategies added without new services
6. **Code Reuse**: Maximizes shared authentication, validation, context logic

**Complexity Mitigation**:
- Use strategy pattern for clear separation of concerns
- Comprehensive integration tests for strategy selection
- Feature flags for enabling/disabling strategies
- Clear documentation of strategy selection logic
- Monitoring per strategy (even within single service)

---

## Option 4: Other Architectural Approaches Considered

### Option 4A: Server-Side Rendering (SSR) with Hydration

**Architecture**: Traditional React SSR with hydration on client.

**Why Not Chosen**:
- **CSS-in-JS Complexity**: Chakra UI v3 requires complex CSS extraction
- **Bundle Size**: Must ship entire Nimbus library to client (~400-600 KB)
- **Hydration Issues**: Coordination between server/client error-prone
- **Edge Incompatibility**: CSS-in-JS difficult in edge environments
- **Duplicate Code**: Client receives code it may already have (for internal apps)

**Use Case Misalignment**: SSR optimizes for SEO and initial render speed. Our use case prioritizes bundle size and design system consistency across contexts.

### Option 4B: Web Components with Shadow DOM

**Architecture**: Package Nimbus components as web components for universal embedding.

**Why Not Chosen**:
- **React Interop**: Chakra UI and React Aria don't play well with Shadow DOM
- **Styling Isolation**: Shadow DOM prevents theme inheritance
- **Bundle Size**: Each component includes full React + Chakra (~400-600 KB per component)
- **Limited Nimbus Coverage**: Not all Nimbus components can be web components
- **Development Overhead**: Requires rewriting components for web component API

**Technical Barrier**: Nimbus built on React Aria and Chakra UI, which have fundamental incompatibilities with Shadow DOM styling model.

### Option 4C: GraphQL for UI Descriptions

**Architecture**: Use GraphQL schema to describe UI structure, resolve to Nimbus components.

**Example**:
```graphql
query UIDescriptor {
  alert {
    title
    description
    status
    actions {
      label
      action
    }
  }
}
```

**Why Not Chosen**:
- **Over-Engineering**: GraphQL solves data fetching, not UI rendering
- **Impedance Mismatch**: GraphQL schema != Component tree structure
- **No Type Safety**: GraphQL types don't map to React props
- **Additional Complexity**: Requires GraphQL server, resolvers, schema maintenance
- **Query Overhead**: Extra network round-trip vs direct element description

**Problem Mismatch**: GraphQL excels at flexible data fetching. We need deterministic UI rendering with type-safe component props.

### Option 4D: Micro-Frontends with Module Federation

**Architecture**: Deploy Nimbus components as federated modules loaded at runtime.

**Why Not Chosen**:
- **Runtime Overhead**: Module loading adds latency to every UI render
- **Version Coordination**: Managing federated module versions across apps
- **Build Complexity**: Webpack Module Federation configuration maintenance
- **External Apps**: Still doesn't solve external app problem (no Nimbus installed)
- **Over-Engineering**: Solves team autonomy problem, not UI rendering problem

**Scope Mismatch**: Module Federation enables independent teams to deploy UI modules. Our problem is rendering Nimbus components in contexts without Nimbus.

---

## Summary and Decision Rationale

### Chosen Architecture: Unified MCP-UI Service with Remote DOM Pattern

**Core Decision**: Single MCP-UI service supporting three rendering strategies (Remote DOM, HTML Snippet, Hosted Widget) selected via strategy pattern.

**Universal Applicability**: MCP-UI works with **any prompt-based LLM workflow**, not just Model Context Protocol implementations. This includes:
- Custom chatbot applications
- LangChain and AutoGPT workflows
- Conversational AI interfaces
- Customer support automation
- AI agent frameworks
- Any LLM application requiring visual UI responses

**Why This Approach**:

1. **Design System Alignment**: Direct mapping between MCP-UI element names and Nimbus components eliminates translation layers and maintains design system fidelity.

2. **Operational Simplicity**: Single service reduces infrastructure complexity (one K8s deployment, one auth integration, one monitoring setup) while maintaining 70% code reuse across strategies.

3. **Universal LLM Integration**: Protocol-agnostic design works with any LLM framework or application architecture, not locked into specific protocols.

4. **Type Safety**: End-to-end TypeScript from server element creation to client rendering catches errors at compile time, critical for production reliability.

5. **Progressive Enhancement**: Architecture supports starting with Remote DOM for internal apps, then adding HTML Snippet and Hosted Widget strategies as external app requirements emerge.

6. **Bundle Efficiency**: Remote DOM pattern achieves ~85% bundle size reduction vs traditional SSR for internal apps (~60 KB vs ~400-600 KB).

7. **Future-Proof**: Strategy pattern enables adding new rendering approaches without architectural changes or new services.

### Key Trade-offs Accepted

**Complexity for Flexibility**: Unified service has more internal complexity than separate services, but this is managed through clear architectural patterns (strategy pattern, factory pattern) and comprehensive testing.

**Protocol Dependency**: Adopting MCP-UI ties architecture to protocol evolution, but MCP's momentum and Model Context Protocol standardization mitigate this risk.

**Multi-Strategy Maintenance**: Supporting three rendering strategies requires maintaining three codepaths, but shared infrastructure (70% of code) and clear boundaries make this manageable.

### Implementation Priorities

1. **Phase 1**: Remote DOM for internal applications (highest ROI, simplest implementation)
2. **Phase 2**: HTML Snippet rendering for external low-complexity components
3. **Phase 3**: Hosted Widget infrastructure for external high-complexity components

This phased approach validates architecture decisions incrementally while delivering value at each stage.

---

**Document Status**: Living document - update as new options emerge or requirements evolve.

**Last Updated**: 2025-12-05
