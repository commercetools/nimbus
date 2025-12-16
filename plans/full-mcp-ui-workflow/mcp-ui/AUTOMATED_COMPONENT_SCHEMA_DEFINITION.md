# Proposal: MCP-UI Component Schema Generation from RAML API Definitions

## Executive Summary

This proposal outlines a system for automatically generating **Nimbus MCP-UI component schema definitions** from RAML (RESTful API Modeling Language) API specifications. By bridging API contracts and MCP-UI virtual DOM descriptions, we can accelerate LLM-driven UI generation, ensure type safety, and reduce manual schema maintenance.

## Problem Statement

Current challenges in MCP-UI adoption and API-driven interfaces:

1. **Manual Schema Authoring**: Each API resource requires hand-crafted MCP-UI element creation code
2. **Schema Proliferation**: Multiple LLM applications need component schemas for the same API resources
3. **Drift and Inconsistency**: API changes don't automatically propagate to component schemas
4. **Development Overhead**: Developers manually translate API contracts into virtual DOM creation patterns
5. **Type Safety Gaps**: No validation that generated virtual DOM matches API structures

## Proposed Solution

### Overview

Create an automated pipeline that:
1. Parses RAML API definitions (resource schemas and data types)
2. Maps RAML types to appropriate Nimbus components (forms, tables, displays)
3. Generates MCP-UI server-side element creation functions
4. Creates TypeScript type definitions for virtual DOM schemas
5. Produces MCP tool handlers for LLM integration

### Architecture

```
┌──────────────────┐
│  RAML Files      │
│  (API Specs)     │
└────────┬─────────┘
         │
         ▼
┌─────────────────────────────┐
│  RAML Parser                │
│  - Resource extraction      │
│  - Type normalization       │
│  - Schema validation        │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  MCP-UI Schema Transformer  │
│  - Component type selection │
│  - Props mapping            │
│  - Virtual DOM patterns     │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Code Generator             │
│  - createElement() calls    │
│  - Type definitions         │
│  - MCP tool schemas         │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  MCP-UI Server Components   │
│  - Element creation funcs   │
│  - Tool handlers            │
│  - Type-safe schemas        │
└─────────────────────────────┘
```

## Technical Approach

### 1. RAML Parsing

**Library**: `@raml/parser` or `raml-1-parser`

```typescript
// packages/nimbus-raml-mcp-generator/src/parser.ts

import { loadApiSync } from '@raml/parser';

export interface RamlResource {
  path: string;
  displayName: string;
  methods: RamlMethod[];
  types: RamlDataType[];
}

export interface RamlDataType {
  name: string;
  properties: RamlProperty[];
  annotations?: RamlAnnotations;
}

export interface RamlProperty {
  name: string;
  type: string;
  required: boolean;
  description?: string;
  enum?: string[];
  pattern?: string;
  minimum?: number;
  maximum?: number;
}

export function parseRamlSpec(filePath: string): RamlResource[] {
  const api = loadApiSync(filePath);
  return extractResources(api);
}
```

### 2. Type Mapping to Nimbus Components

Map RAML types to appropriate MCP-UI component patterns:

| RAML Type | Display Component | Form Component | Notes |
|-----------|-------------------|----------------|-------|
| `string` | `Text` | `TextInput` | Basic string display/input |
| `string` (enum) | `Badge` | `Select` | Enumerated values |
| `integer` / `number` | `Text` | `NumberInput` | Numeric values |
| `boolean` | `Badge` (Yes/No) | `Switch` / `Checkbox` | Boolean states |
| `date-only` | `Text` (formatted) | `DatePicker` | Date values |
| `datetime` | `Text` (formatted) | `DatePicker` (with time) | Date with time |
| `object` | `Card` layout | Form group | Nested structures |
| `array` (objects) | `DataTable` | N/A | Tabular data |
| `array` (primitives) | `Stack` layout | `ComboBox` | Lists |
| Money type | `Text` (formatted) | `MoneyInput` | Currency values |

### 3. Schema Transformer

```typescript
// packages/nimbus-raml-mcp-generator/src/transformer.ts

export interface MCPUIComponentSchema {
  resourceName: string;
  resourcePath: string;
  displayComponents: ElementCreationFunction[];
  formComponents: ElementCreationFunction[];
  toolSchema: MCPToolSchema;
}

export interface ElementCreationFunction {
  functionName: string;
  elementType: string; // 'nimbus-text', 'nimbus-badge', etc.
  props: PropMapping[];
  children?: ElementCreationFunction[];
}

export interface PropMapping {
  ramlProperty: string;
  componentProp: string;
  transformer?: string; // 'formatDate', 'formatMoney', etc.
}

export interface MCPToolSchema {
  name: string;
  description: string;
  inputSchema: object; // JSON Schema
  handler: string; // Generated handler function name
}

export function transformRamlToMCPUISchema(
  ramlType: RamlDataType,
  mode: 'display' | 'form'
): MCPUIComponentSchema {
  const properties = ramlType.properties;

  return {
    resourceName: ramlType.name,
    resourcePath: extractPath(ramlType),
    displayComponents: mode === 'display'
      ? generateDisplayElements(properties)
      : [],
    formComponents: mode === 'form'
      ? generateFormElements(properties)
      : [],
    toolSchema: generateToolSchema(ramlType),
  };
}
```

### 4. MCP-UI Code Generation

Generate actual createElement() calls and MCP tool handlers:

```typescript
// packages/nimbus-raml-mcp-generator/src/generator.ts

export interface GeneratorOptions {
  outputDir: string;
  mode: 'display' | 'form' | 'both';
  includeValidation: boolean;
  includeToolHandlers: boolean;
}

export async function generateMCPUICode(
  schemas: MCPUIComponentSchema[],
  options: GeneratorOptions
): Promise<void> {
  for (const schema of schemas) {
    // Generate element creation functions
    await generateElementCreators(schema, options);

    // Generate type definitions
    await generateTypeDefinitions(schema, options);

    // Generate MCP tool handlers
    if (options.includeToolHandlers) {
      await generateToolHandlers(schema, options);
    }
  }
}
```

### 5. Generated Code Pattern

**Element Creation Functions** (output example):

```typescript
// Generated: src/generated/product-display.ts
import { createElement, NimbusElements } from '@commercetools/nimbus-mcp-ui-server';

export interface ProductData {
  id: string;
  name: string;
  price: number;
  category: 'Electronics' | 'Clothing' | 'Food';
  inStock: boolean;
  createdAt: string;
}

/**
 * Creates a display view for Product resource
 * @generated from RAML: api/products.raml
 */
export function createProductDisplay(data: ProductData) {
  return createElement(
    NimbusElements.CARD_ROOT,
    {},
    [
      createElement(
        NimbusElements.CARD_HEADER,
        {},
        [
          createElement(NimbusElements.HEADING, {
            level: 2,
            children: data.name,
          }),
          createElement(NimbusElements.BADGE, {
            colorPalette: data.inStock ? 'positive' : 'critical',
            children: data.inStock ? 'In Stock' : 'Out of Stock',
          }),
        ]
      ),
      createElement(
        NimbusElements.CARD_BODY,
        {},
        [
          createElement(
            NimbusElements.STACK,
            { direction: 'column', gap: '300' },
            [
              createElement(
                NimbusElements.TEXT,
                {},
                `Price: ${formatMoney(data.price, 'USD')}`
              ),
              createElement(
                NimbusElements.TEXT,
                {},
                `Category: ${data.category}`
              ),
              createElement(
                NimbusElements.TEXT,
                { size: 'sm', colorPalette: 'neutral' },
                `Created: ${formatDate(data.createdAt)}`
              ),
            ]
          ),
        ]
      ),
    ]
  );
}
```

**Form Creation Functions** (output example):

```typescript
// Generated: src/generated/product-form.ts
import { createElement, NimbusElements } from '@commercetools/nimbus-mcp-ui-server';

export interface ProductFormData {
  name?: string;
  price?: number;
  category?: 'Electronics' | 'Clothing' | 'Food';
  inStock?: boolean;
}

/**
 * Creates a form for editing Product resource
 * @generated from RAML: api/products.raml
 */
export function createProductForm(data?: ProductFormData) {
  return createElement(
    NimbusElements.FORM_ROOT,
    {},
    [
      createElement(
        NimbusElements.STACK,
        { direction: 'column', gap: '400' },
        [
          createElement(
            NimbusElements.FORM_FIELD,
            { label: 'Product Name', isRequired: true },
            [
              createElement(NimbusElements.TEXT_INPUT, {
                name: 'name',
                defaultValue: data?.name,
                placeholder: 'Enter product name',
              }),
            ]
          ),
          createElement(
            NimbusElements.FORM_FIELD,
            { label: 'Price', isRequired: true },
            [
              createElement(NimbusElements.MONEY_INPUT, {
                name: 'price',
                currency: 'USD',
                defaultValue: data?.price,
              }),
            ]
          ),
          createElement(
            NimbusElements.FORM_FIELD,
            { label: 'Category', isRequired: true },
            [
              createElement(
                NimbusElements.SELECT_ROOT,
                { name: 'category', defaultValue: data?.category },
                [
                  createElement(NimbusElements.SELECT_TRIGGER, {
                    placeholder: 'Select category',
                  }),
                  createElement(
                    NimbusElements.SELECT_CONTENT,
                    {},
                    [
                      createElement(NimbusElements.SELECT_OPTION, {
                        value: 'Electronics',
                        children: 'Electronics',
                      }),
                      createElement(NimbusElements.SELECT_OPTION, {
                        value: 'Clothing',
                        children: 'Clothing',
                      }),
                      createElement(NimbusElements.SELECT_OPTION, {
                        value: 'Food',
                        children: 'Food',
                      }),
                    ]
                  ),
                ]
              ),
            ]
          ),
          createElement(
            NimbusElements.FORM_FIELD,
            { label: 'In Stock' },
            [
              createElement(NimbusElements.SWITCH, {
                name: 'inStock',
                defaultChecked: data?.inStock,
              }),
            ]
          ),
        ]
      ),
    ]
  );
}
```

**MCP Tool Handler** (output example):

```typescript
// Generated: src/generated/product-tools.ts
import { z } from 'zod';
import { createProductDisplay, createProductForm } from './product-display';
import type { ProductData, ProductFormData } from './product-display';

/**
 * MCP Tool: Display Product
 * @generated from RAML: api/products.raml
 */
export const displayProductTool = {
  name: 'display-product',
  description: 'Display a product with rich formatting',
  inputSchema: {
    type: 'object',
    properties: {
      productId: {
        type: 'string',
        description: 'Product ID to display',
      },
    },
    required: ['productId'],
  },
  handler: async (args: { productId: string }) => {
    // Fetch product data from API
    const product = await fetchProduct(args.productId);

    // Generate virtual DOM
    const virtualElement = createProductDisplay(product);

    return {
      content: [{
        type: 'resource',
        resource: virtualElement,
      }],
    };
  },
};

/**
 * MCP Tool: Edit Product Form
 * @generated from RAML: api/products.raml
 */
export const editProductTool = {
  name: 'edit-product-form',
  description: 'Display a form for editing a product',
  inputSchema: {
    type: 'object',
    properties: {
      productId: {
        type: 'string',
        description: 'Product ID to edit',
      },
    },
    required: ['productId'],
  },
  handler: async (args: { productId: string }) => {
    // Fetch product data
    const product = await fetchProduct(args.productId);

    // Generate form virtual DOM
    const virtualElement = createProductForm(product);

    return {
      content: [{
        type: 'resource',
        resource: virtualElement,
      }],
    };
  },
};
```

### 6. RAML Annotations for UI Hints

Support custom RAML annotations to guide component selection:

```yaml
# api/products.raml
#%RAML 1.0
title: Product API

annotationTypes:
  mcpUiHint:
    type: object
    properties:
      displayComponent?: string
      formComponent?: string
      componentProps?: object
      formatter?: string

types:
  Product:
    properties:
      name:
        type: string
        required: true
        (mcpUiHint):
          displayComponent: nimbus-heading
          formComponent: nimbus-text-input
          componentProps:
            size: md
      price:
        type: number
        required: true
        (mcpUiHint):
          displayComponent: nimbus-text
          formComponent: nimbus-money-input
          formatter: formatMoney
          componentProps:
            currency: USD
      category:
        type: string
        enum: [Electronics, Clothing, Food]
        (mcpUiHint):
          displayComponent: nimbus-badge
          formComponent: nimbus-select
          componentProps:
            variant: outline
      status:
        type: string
        enum: [active, inactive]
        (mcpUiHint):
          displayComponent: nimbus-status-badge
          formComponent: nimbus-toggle-button-group
```

## Implementation Plan

### Phase 1: Parser & Transformer (2-3 weeks)

- [ ] Set up `@commercetools/nimbus-raml-mcp-generator` package
- [ ] Implement RAML parsing with `@raml/parser`
- [ ] Create type mapping system (RAML → Nimbus components)
- [ ] Build schema transformer (RAML → MCP-UI schema)
- [ ] Support custom annotations for UI hints

### Phase 2: Code Generation (2-3 weeks)

- [ ] Implement element creation function generator
- [ ] Generate TypeScript type definitions
- [ ] Create template system with Handlebars
- [ ] Add validation and error handling
- [ ] Generate data formatter utilities

### Phase 3: MCP Tool Integration (1-2 weeks)

- [ ] Generate MCP tool handler skeletons
- [ ] Create tool schema definitions
- [ ] Integrate with MCP server patterns
- [ ] Add API fetching utilities
- [ ] Support authentication patterns

### Phase 4: Advanced Features (2-3 weeks)

- [ ] Support complex nested structures
- [ ] Add DataTable generation for arrays
- [ ] Implement form validation rules
- [ ] Generate i18n message definitions
- [ ] Add custom template overrides

### Phase 5: Tooling & Documentation (1-2 weeks)

- [ ] Create CLI tool for generation
- [ ] Add watch mode for development
- [ ] Build VS Code extension
- [ ] Write comprehensive documentation
- [ ] Create example projects

## Usage Examples

### CLI Usage

```bash
# Generate MCP-UI schemas from RAML
pnpm raml-mcp-generate \
  --spec api/products.raml \
  --output src/generated \
  --mode both

# Watch mode for development
pnpm raml-mcp-generate \
  --spec api/*.raml \
  --watch

# Generate with custom templates
pnpm raml-mcp-generate \
  --spec api/products.raml \
  --templates ./custom-templates
```

### Configuration File

```typescript
// raml-mcp-generator.config.ts
import { defineConfig } from '@commercetools/nimbus-raml-mcp-generator';

export default defineConfig({
  specs: [
    {
      path: 'api/products.raml',
      outputDir: 'src/generated/products',
      mode: 'both', // display and form
    },
    {
      path: 'api/orders.raml',
      outputDir: 'src/generated/orders',
      mode: 'display', // display only
    },
  ],

  componentMappings: {
    // Custom type → component mappings
    'Money': {
      display: 'nimbus-text',
      form: 'nimbus-money-input',
      formatter: 'formatMoney',
    },
  },

  templates: {
    display: './templates/custom-display.hbs',
    form: './templates/custom-form.hbs',
  },

  hooks: {
    beforeGenerate: async (schema) => {
      // Custom transformation logic
    },
    afterGenerate: async (files) => {
      // Post-processing (lint, format, etc.)
    },
  },
});
```

### Integration with MCP Server

```typescript
// src/mcp-server.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

// Import generated tools
import {
  displayProductTool,
  editProductTool,
} from './generated/products/product-tools';

const server = new Server({
  name: 'products-mcp-server',
  version: '1.0.0',
}, {
  capabilities: {
    tools: {},
  },
});

// Register generated tools
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case 'display-product':
      return await displayProductTool.handler(request.params.arguments);

    case 'edit-product-form':
      return await editProductTool.handler(request.params.arguments);

    default:
      throw new Error(`Unknown tool: ${request.params.name}`);
  }
});

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);
```

## Benefits

### For Developers

1. **Rapid Prototyping**: Generate 80%+ of MCP-UI code from API specs
2. **Type Safety**: End-to-end type safety from API to virtual DOM
3. **Consistency**: Standardized patterns across resources
4. **Reduced Errors**: Eliminate manual transcription mistakes

### For Teams

1. **API-First Development**: UI generation follows API contracts
2. **Automatic Updates**: API changes propagate to UI code
3. **Documentation**: Generated code includes API source references
4. **Faster Iterations**: Modify RAML, regenerate UI code

### For MCP-UI Adoption

1. **Lower Barrier**: Quick start with generated code
2. **Best Practices**: Templates encode Nimbus patterns
3. **Scalability**: Handle many API resources efficiently
4. **Customization**: Override generated code as needed

## Integration with MCP-UI Architecture

### Alignment with Remote DOM Pattern

Generated code produces virtual DOM descriptions compatible with the three delivery methods:

1. **Remote DOM**: Generated `createElement()` calls work directly
2. **HTML Snippet Rendering**: Pass generated elements to Component Rendering Service
3. **Hosted Widgets**: Embed generated forms in widget infrastructure

### Theme Context Propagation

Generated code includes theme metadata:

```typescript
export function createProductDisplay(data: ProductData, context?: MCPContext) {
  return createElement(
    NimbusElements.CARD_ROOT,
    {},
    [
      // Generated element tree...
    ],
    {
      // Metadata for theme application
      __context: {
        organizationId: context?.organizationId,
        projectId: context?.projectId,
        theme: context?.theme,
        locale: context?.locale,
      },
    }
  );
}
```

### Component Rendering Service Integration

Generated schemas work seamlessly with the Component Rendering Service:

```typescript
// MCP Server uses generated function
const virtualElement = createProductDisplay(productData, context);

// Send to Component Rendering Service for SSR
const htmlResponse = await componentRenderingService.render({
  element: virtualElement,
  context: {
    organizationId: 'org-123',
    theme: 'custom-brand',
  },
});
```

## Success Metrics

### Quantitative

- **Time Saved**: 70% reduction in MCP-UI schema creation time
- **Type Coverage**: 100% type safety from API to UI
- **Code Quality**: Consistent patterns across all generated code
- **Error Reduction**: 50% fewer schema-related bugs

### Qualitative

- Developer satisfaction with generated code quality
- Ease of customization and extension
- Integration smoothness with MCP servers
- Documentation clarity

## Risks and Mitigations

### Risk: Complex RAML Structures

**Mitigation**:
- Start with common patterns (CRUD resources)
- Provide escape hatches for manual overrides
- Document limitations clearly
- Support progressive enhancement

### Risk: Over-abstraction

**Mitigation**:
- Generated code should be readable and understandable
- Allow template customization
- Support partial generation
- Maintain clear relationship to RAML source

### Risk: Maintenance Burden

**Mitigation**:
- Comprehensive test suite
- Clear ownership and documentation
- Automated updates for Nimbus changes
- Community feedback loop

## Future Enhancements

### Short Term
- OpenAPI/Swagger support
- GraphQL schema integration
- Visual schema editor

### Long Term
- AI-powered component selection
- Runtime schema validation
- Bidirectional sync (UI → API updates)
- Cross-platform code generation

## Conclusion

Generating MCP-UI component schemas from RAML API definitions accelerates LLM-driven UI development by automating the translation from backend contracts to frontend virtual DOM descriptions. This proposal provides a pragmatic, phased approach that delivers immediate value while supporting future extensibility within the MCP-UI ecosystem.

## Appendix

### A. Technology Stack

- **Parser**: `@raml/parser` or `raml-1-parser`
- **Code Generation**: `ts-morph` for TypeScript AST
- **Templates**: Handlebars or custom template engine
- **CLI**: Commander.js
- **Testing**: Vitest with integration tests

### B. Package Structure

```
packages/nimbus-raml-mcp-generator/
├── src/
│   ├── parser/              # RAML parsing
│   ├── transformer/         # Schema transformation
│   ├── generator/           # Code generation
│   ├── templates/           # Generation templates
│   ├── cli/                 # CLI interface
│   └── index.ts             # Public API
├── templates/               # Default templates
│   ├── display.hbs
│   ├── form.hbs
│   └── tool-handler.hbs
├── examples/                # Example projects
└── docs/                    # Documentation
```

### C. Related Documentation

- [MCP-UI Implementation Plan](../IMPLEMENTATION_PLAN.md)
- [Remote DOM Architecture](./MCP_UI_IMPLEMENTATION.md)
- [Component Rendering Service](../ssr/component-rendering-service/COMPONENT_RENDERING_SERVICE_IMPLEMENTATION.md)

---

**Document Status**: Proposal Draft
**Author**: Claude (AI Assistant)
**Date**: 2025-12-06
**Review Status**: Pending
**Target Phase**: Phase 1 (Remote DOM Foundation) or Phase 2 (Themed Rendering)
