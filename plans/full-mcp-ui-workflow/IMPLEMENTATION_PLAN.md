# MCP-UI Implementation Plan

## Overview

This implementation plan provides a phase-based checklist for delivering the MCP-UI system. Work is organized into **three parallel buckets** that can be developed simultaneously with clear integration points.

**Timeline**: 12-14 weeks (3-3.5 months)
**Team**: Nimbus Team (mcp-ui team)
**Approach**: Parallel workstreams with incremental value delivery

---

## Architecture Overview

The MCP-UI system enables LLM applications to generate rich, interactive, brand-consistent user interfaces by coordinating three core services:

![MCP-UI Architecture Flow](./assets/sequence-diagram.png)

### System Flow

1. **User Request** → User interacts with LLM application (e.g., "Show me sales data as a table")
2. **LLM Processing** → LLM determines appropriate Nimbus component and data structure
3. **Component Specification** → MCP-UI Server receives structured component request with organization/project context
4. **Theme Resolution** → Theme Service retrieves brand-specific design tokens (with caching)
5. **Component Rendering** → Rendering Service applies theme and generates output (Virtual DOM, HTML, or Widget)
6. **Response Assembly** → Fully-themed, accessible UI returned to LLM application
7. **User Display** → Interactive, branded component displayed to user

### Three Integration Points

- **🔵 MCP-UI Server**: Coordinates component requests and orchestrates the workflow
- **🟢 Theme Service**: Provides dynamic, project-specific design tokens and branding
- **🟠 Rendering Service**: Performs SSR with theme application and hydration support

### Component Delivery Methods

The system supports three delivery approaches based on use case:

| Method | Use Case | Bundle Size | Rendering |
|--------|----------|-------------|-----------|
| **Remote DOM** | Internal apps (Nimbus installed) | ~30 KB virtual DOM | Client-side mapping |
| **HTML Snippet** | External apps (simple components) | ~10-30 KB SSR HTML | Pure SSR, no hydration |
| **Hosted Widget** | External apps (complex components) | ~150 KB hydration runtime | SSR + hydration |

---

## Table of Contents

1. [Implementation Buckets](#implementation-buckets)
2. [Phase 1: Remote DOM Foundation](#phase-1-remote-dom-foundation-weeks-1-4)
3. [Phase 2: Themed Rendering](#phase-2-themed-rendering-weeks-5-7)
4. [Phase 3: External Use Cases](#phase-3-external-use-cases-weeks-8-11)
5. [Phase 4: Production Hardening](#phase-4-production-hardening-weeks-12-14)
6. [Dependencies & Critical Path](#dependencies--critical-path)
7. [Success Criteria](#success-criteria)
8. [Risk Management](#risk-management)
9. [Documentation Structure](#documentation-structure)

---

## Implementation Buckets

### 🔵 Bucket 1: MCP-UI Server/Client Implementation

Core protocol enabling LLM agents to specify and render Nimbus components.

**Components**: MCP Server Tools, Remote DOM, HTML Snippets, Hosted Widgets, Component Coverage

### 🟢 Bucket 2: Theming Support & Service

Infrastructure for dynamic theme application and multi-tenant theming.

**Components**: Theme Serialization, Theme Service API, Token Management, Multi-Brand Support

### 🟠 Bucket 3: SSR & Component Rendering Service

Server-side rendering with hydration for high-complexity components.

**Components**: SSR Foundation, Component Rendering Service, Hydration Runtime, Performance Optimization

---

## Phase 1: Remote DOM Foundation (Weeks 1-4)

**Goal**: Functional MCP-UI for internal apps + SSR-ready Nimbus components

### 🔵 MCP-UI Tasks

- [ ] Define MCP server tool schemas for core Nimbus components
- [ ] Implement Remote DOM virtual element creation (`createElement()`)
- [ ] Create element name registry (`NimbusElements.BUTTON`, etc.)
- [ ] Build client-side element mapping system (`mapVirtualElement()`)
- [ ] Create server and client packages (`@commercetools/nimbus-mcp-ui-server`, `@commercetools/nimbus-mcp-ui-client`)
- [ ] Write integration tests for server-to-client flow
- [ ] Test MCP-UI with sample LLM client integration
- [ ] Document Remote DOM architecture and API

### 🟢 Theming Tasks

- [ ] Define theme serialization format specification
- [ ] Implement theme serialization utilities (convert Nimbus themes to portable format)
- [ ] Design Theme Service API structure (GraphQL schema)
- [ ] Document theme serialization patterns

### 🟠 SSR Tasks

- [ ] Audit Nimbus components for browser API usage (create `audit-browser-apis.js`)
- [ ] Create SSR-safe utility hooks (`useIsClient`, `useSafeLayoutEffect`)
- [ ] Fix FormField component with CSS Grid layout (remove useEffect-based layout)
- [ ] Fix Card component with CSS Grid layout (remove useEffect-based layout)
- [ ] Fix all components flagged by audit (add `useIsClient` guards)
- [ ] Consolidate NimbusI18nProvider with SSRProvider
- [ ] Create ColorModeScript component (inline script generation)
- [ ] Set up SSR testing infrastructure (`vitest.ssr.config.ts`)
- [ ] Write SSR tests for critical components
- [ ] Verify zero hydration mismatches

**Phase 1 Deliverable**: Remote DOM operational for internal apps with default theming

---

## Phase 2: Themed Rendering (Weeks 5-7)

**Goal**: Dynamic theming integrated across all rendering strategies

### 🔵 MCP-UI Tasks

- [ ] Expand component schema coverage (forms, tables, complex layouts)
- [ ] Implement theme context propagation in Remote DOM
- [ ] Add theme metadata to virtual elements
- [ ] Test themed component rendering
- [ ] Document component specification patterns

### 🟢 Theming Tasks

- [ ] Build Theme Service GraphQL API (Prisma models, resolvers)
- [ ] Implement color generation algorithm (Radix 12-step methodology)
- [ ] Create WCAG contrast validation utilities
- [ ] Add design token override system
- [ ] Implement theme validation (integrity, accessibility, compatibility)
- [ ] Build organization and project-level theme management
- [ ] Create theme fallback logic (project → organization → default)
- [ ] Integrate Theme Service with merchant-center-settings
- [ ] Add authentication/authorization checks
- [ ] Document Theme Service API and usage patterns

### 🟠 SSR Tasks

- [ ] Create Component Rendering Service (Node.js + Express)
- [ ] Implement commercetools-identity OAuth2 authentication
- [ ] Integrate Theme Service API client with caching layer
- [ ] Build server entry point (`packages/nimbus/src/server.ts`)
- [ ] Configure package exports for `/server` subpath
- [ ] Implement SSR with theme application
- [ ] Create hydration runtime for client-side interactivity
- [ ] Add request validation (Zod schemas)
- [ ] Implement error handling middleware
- [ ] Set up observability (Winston logging, Prometheus metrics)
- [ ] Write integration tests (SSR + theme + hydration)
- [ ] Document rendering service API

**Phase 2 Deliverable**: Component Rendering Service with Theme Service integration

---

## Phase 3: External Use Cases (Weeks 8-11)

**Goal**: HTML snippets and hosted widgets for external applications

### 🔵 MCP-UI Tasks

- [ ] Implement HTML snippet rendering pipeline (SSR to static HTML)
- [ ] Create hosted widget infrastructure (iframe/web component)
- [ ] Build widget embedding system
- [ ] Add component coverage for common external use cases
- [ ] Test HTML snippets in sample external app
- [ ] Test hosted widgets with various embedding scenarios
- [ ] Document component delivery methods (Remote DOM vs HTML vs Widget)

### 🟢 Theming Tasks

- [ ] Implement multi-brand theme management
- [ ] Add theme caching strategy (in-memory, Redis)
- [ ] Create theme performance optimization
- [ ] Deploy Theme Service to production
- [ ] Set up monitoring and alerting
- [ ] Document multi-tenant theming patterns

### 🟠 SSR Tasks

- [ ] Optimize SSR performance (caching, code splitting)
- [ ] Implement theme caching (5-minute TTL)
- [ ] Create HTML caching for rendered output
- [ ] Build Kubernetes deployment manifests (Deployment, Service, HPA)
- [ ] Deploy hydration runtime to CDN
- [ ] Set up Prometheus scraping and Grafana dashboards
- [ ] Configure Falcon LogScale/Humio integration
- [ ] Implement health checks and readiness probes
- [ ] Test horizontal scaling and zero-downtime updates
- [ ] Load test Component Rendering Service
- [ ] Document deployment architecture and operations

**Phase 3 Deliverable**: Production SSR with external application support via HTML snippets and hosted widgets

---

## Phase 4: Production Hardening (Weeks 12-14)

**Goal**: Fully monitored, documented, production-ready system

### 🔵 MCP-UI Tasks

- [ ] Production deployment of MCP-UI services
- [ ] Create comprehensive API documentation (OpenAPI/Swagger)
- [ ] Write integration guides for LLM applications
- [ ] Build interactive examples and playground
- [ ] Create troubleshooting guide
- [ ] Set up monitoring dashboards
- [ ] Conduct security audit

### 🟢 Theming Tasks

- [ ] Production theme service hardening
- [ ] Set up performance monitoring
- [ ] Create theme configuration documentation
- [ ] Build CLI tool for local theme generation (`pnpm nimbus generate-theme`)
- [ ] Write migration guides for custom palettes
- [ ] Add color scale visualization tools

### 🟠 SSR Tasks

- [ ] Production infrastructure hardening
- [ ] Complete observability setup (metrics, logs, alerts)
- [ ] Write operational runbooks
- [ ] Create incident response procedures
- [ ] Build SSR framework guides (Next.js, Gatsby, Remix)
- [ ] Add SSR troubleshooting documentation
- [ ] Conduct accessibility audit
- [ ] Performance benchmarking and optimization
- [ ] Set up automated testing in CI/CD

### Cross-Cutting Tasks

- [ ] Comprehensive integration testing (all three buckets)
- [ ] End-to-end testing with sample applications
- [ ] Bundle size validation
- [ ] Accessibility compliance verification (WCAG 2.1 AA)
- [ ] Browser compatibility testing
- [ ] Security vulnerability scanning
- [ ] Load testing at scale
- [ ] Documentation review and polish

**Phase 4 Deliverable**: Production-ready, documented, monitored system

---

## Dependencies & Critical Path

### Critical Path

```
Phase 1: Remote DOM + SSR Foundation
  ↓
Phase 2: Theme Service + Rendering Service Integration
  ↓
Phase 3: External Component Delivery
  ↓
Phase 4: Production Hardening
```

### Key Dependencies

**Between Buckets**:
- 🟢 Theme serialization → 🔵 Themed rendering
- 🟠 SSR support → 🔵 HTML snippets and widgets
- 🟢 Theme Service → 🟠 Rendering Service (theme injection)

**Within Phases**:
- Phase 1: SSR foundation blocks themed rendering
- Phase 2: Theme Service blocks dynamic theming
- Phase 3: Rendering Service blocks HTML/widget deployment
- Phase 4: All prior phases complete

### Parallel Work Opportunities

**Phase 1**:
- 🔵 MCP-UI + 🟢 Theme serialization + 🟠 SSR fixes (all independent)

**Phase 2**:
- 🔵 Component coverage + 🟢 Theme Service + 🟠 Rendering Service (mostly independent)

**Phase 3**:
- 🔵 Widget system + 🟢 Multi-tenant setup + 🟠 Performance optimization

**Phase 4**:
- All three buckets can harden in parallel

---

## Success Criteria

### Technical Metrics

**Performance**:
- [ ] Component Rendering Service response times meet SLA targets
- [ ] Theme Service response times meet SLA targets
- [ ] SSR Time to First Byte meets performance goals
- [ ] Runtime bundle size increase is minimal and acceptable
- [ ] Theme cache hit rate is optimized
- [ ] Zero hydration mismatches

**Quality**:
- [ ] Test coverage meets project standards
- [ ] WCAG 2.1 AA compliance verified
- [ ] Critical bugs resolved within acceptable timeframes
- [ ] All browser compatibility targets met

**Scalability**:
- [ ] Horizontal scaling verified (HPA functional)
- [ ] Zero-downtime deployments working
- [ ] Load testing passed at expected traffic volumes

### Developer Experience

**Ease of Use**:
- [ ] SSR setup time is minimal
- [ ] Theme generation is fast
- [ ] Custom palette creation is straightforward
- [ ] Clear error messages for all failure modes

**Documentation**:
- [ ] API references complete
- [ ] Integration guides tested with real applications
- [ ] Migration guides validated
- [ ] Troubleshooting guides comprehensive

### Adoption Metrics

**Short-term (3 months)**:
- [ ] Multiple internal applications using MCP-UI
- [ ] Significant adoption of custom themes
- [ ] Active community engagement

**Medium-term (6 months)**:
- [ ] Majority adoption of custom themes
- [ ] Multiple production deployments using Component Rendering Service
- [ ] Positive community feedback and testimonials

---

## Risk Management

### High-Impact Risks

| Risk | Mitigation |
|------|------------|
| **Hydration mismatches** | CSS Grid layouts, comprehensive SSR tests, browser API guards, clear patterns |
| **Theme Service availability** | Default fallback, caching (5-min TTL), multi-region, health checks, graceful degradation |
| **Rendering Service scaling** | HPA, connection pooling, rate limiting, edge caching, theme cache |
| **Security vulnerabilities** | OAuth2 authentication, input validation, CSP headers, regular audits |

### Medium-Impact Risks

| Risk | Mitigation |
|------|------------|
| **Performance degradation** | Bundle size monitoring, benchmarking, tree-shaking verification, separate server entry |
| **Schema evolution** | Semantic versioning, backward compatibility, deprecation notices, migration guides |
| **Cross-browser issues** | Automated testing (Playwright), progressive enhancement, polyfills, support policy |
| **Breaking changes in Nimbus** | Integration testing, version pinning, automated migrations, pre-release testing |

### Low-Impact Risks

| Risk | Mitigation |
|------|------------|
| **Slow adoption** | Developer advocacy, clear documentation, interactive playground, office hours |
| **Maintenance burden** | Automated testing, clear ownership, runbooks, dependency updates |
| **Competing solutions** | Focus on Nimbus integration, ecosystem lock-in, first-mover advantage, innovation |

---

## Documentation Structure

**Core Planning Documents**:
- [EXECUTIVE_SUMMARY.md](./EXECUTIVE_SUMMARY.md) - Business case and value proposition
- [TECHNICAL_SUMMARY.md](./TECHNICAL_SUMMARY.md) - Technical architecture overview
- [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) - This document

**Implementation Guides**:
- [mcp-ui/MCP_UI_IMPLEMENTATION.md](./mcp-ui/MCP_UI_IMPLEMENTATION.md) - Remote DOM implementation
- [ssr/SSR_IMPLEMENTATION.md](./ssr/SSR_IMPLEMENTATION.md) - Server-side rendering setup
- [ssr/component-rendering-service/COMPONENT_RENDERING_SERVICE_IMPLEMENTATION.md](./ssr/component-rendering-service/COMPONENT_RENDERING_SERVICE_IMPLEMENTATION.md) - Rendering service
- [theming/THEMING_IMPLEMENTATION.md](./theming/THEMING_IMPLEMENTATION.md) - Build-time theming
- [theming/theming-service/THEMING_SERVICE_IMPLEMENTATION.md](./theming/theming-service/THEMING_SERVICE_IMPLEMENTATION.md) - Multi-tenant theme service

**Decision Documentation** (OPTIONS_CONSIDERED.md files in each subdirectory)

**Visual Assets** ([assets/](./assets/) directory)

---

**Document Status**: Implementation Plan - Ready for Execution
**Owner**: Nimbus Team (mcp-ui team)
**Last Updated**: 2025-12-05
**Next Review**: After Phase 1 completion
