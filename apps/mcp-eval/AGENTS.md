# MCP Eval

Evaluation harness for the nimbus-mcp server tools. Tests MCP tool responses
against realistic UI Kit fixture files to measure migration coverage, field
richness, and response quality.

## Running

```bash
# Run eval suite (local MCP only)
pnpm --filter mcp-eval eval

# Enable A/B comparison against the published npm version
pnpm --filter mcp-eval add -D "nimbus-mcp-published@npm:@commercetools/nimbus-mcp@latest"
pnpm --filter mcp-eval eval
```

## Structure

```
apps/mcp-eval/
├── src/
│   ├── fixtures/              # Realistic UI Kit source files
│   │   ├── product-list-view.tsx    # List page: DataTable, buttons, filters, layout
│   │   └── product-detail-form.tsx  # Detail form: localized inputs, money, numbers
│   ├── helpers/
│   │   ├── create-client.ts   # MCP client factory (local + published)
│   │   └── compare.ts        # Structured field-level diff
│   └── eval.spec.ts          # Main eval test suite
├── vitest.config.ts
└── package.json
```

## What it evaluates

### File-level migration (`migrate_from_uikit(filePath: "...")`)

- **Coverage**: every UIKit import gets a mapping (few/no unmapped)
- **Layout guidance**: `layoutGuidance` hoisted for nested Spacings/Constraints
- **Rich data**: DataTable includes `propShapeTransforms`, `codeReduction`
- **Style props**: eligible components include `styleProps` hint

### Component-level scenarios (`migrate_from_uikit(componentName: "...")`)

- DataTable: `propShapeTransforms`, `codeReduction`
- CollapsiblePanel: breaking changes for Accordion composition
- SelectInput/DateRangeInput/MoneyInput/NumberInput: `callbackAdapters`
- PrimaryButton: `propMappings`, `propMigrations`
- Spacings: compound root with `layoutGuidance`
- Avatar: `styleProps` hint

### Style props (`get_component`, `get_docs_page`)

- Components with `@supportsStyleProps` include `styleProps` hint
- Style-props landing page returns enriched prop index

### A/B comparison (when published version installed)

- Side-by-side field diff for file migrations
- Component lookup comparison
- `get_component` metadata comparison

## Adding fixtures

Create new `.tsx` files in `src/fixtures/` with realistic UI Kit usage patterns.
The eval suite picks them up via the `FIXTURES` constant in `eval.spec.ts`.

## Adding scenarios

Add entries to `COMPONENT_SCENARIOS` in `eval.spec.ts` for new component-level
eval cases. Each scenario specifies which fields should be present in the
migration response.
