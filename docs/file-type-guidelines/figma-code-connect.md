# Figma Code Connect (`{component}.figma.tsx`)

[← Back to File Type Guidelines](./index.md)

Code Connect files map a Nimbus component to its Figma component so that Figma's
Dev Mode shows real Nimbus code (correct import + props) instead of generic CSS.
They live next to the component
(`packages/nimbus/src/components/{component}/{component}.figma.tsx`) and use the
`@figma/code-connect` library.

## When to create one

Create a `.figma.tsx` when the component exists in the Nimbus Figma library and
should surface its code in Dev Mode. It is **not** a required component file —
components with no Figma counterpart don't need one.

## Do not hand-write these — they are generated

`.figma.tsx` files are produced **deterministically** by the
`nimbus-code-connect` skill from the Figma API plus codified classification
rules. There is no LLM/judgement in the output, so hand edits will be
overwritten on the next regeneration. To add or update a mapping:

```bash
# 1. collect Figma data (needs FIGMA_ACCESS_TOKEN)
pnpm exec tsx .claude/skills/nimbus-code-connect/collect-figma-data.ts
# 2. generate (all components, or pass one name)
pnpm exec tsx .claude/skills/nimbus-code-connect/generate-code-connect.ts [component]
```

Per-component overrides (prop aliases, value normalizations, skipped Figma
props) live in `.claude/skills/nimbus-code-connect/code-connect-constants.ts` —
that file, not the `.figma.tsx`, is where you change generation behavior. See
the
[`nimbus-code-connect` skill](../../.claude/skills/nimbus-code-connect/SKILL.md)
for the full workflow and validation steps.

## Anatomy

```tsx
import figma from "@figma/code-connect/react";
import { Button } from "./button";

figma.connect(
  Button,
  "https://www.figma.com/design/.../NIMBUS-design-system?node-id=67-549",
  {
    props: {
      // Figma "Variant" enum → the component's `variant` prop
      variant: figma.enum("Variant", {
        Solid: "solid",
        Outlined: "outline",
      }),
      // A Figma "State" value can be decomposed into a boolean prop
      isDisabled: figma.enum("State", { Disabled: true }),
      size: figma.enum("Size", { md: "md", sm: "sm" }),
    },
    example: (props) => <Button variant={props.variant} size={props.size} />,
  }
);
```

Key points:

- Import the component from its **implementation file** (`./button`), matching
  the cross-chunk import rule in [naming-conventions](../naming-conventions.md)
  — not the barrel.
- `props` maps Figma properties to real component props; the `example` renders
  the component with those props (the snippet Dev Mode shows).
- Values are normalized to the component's actual prop values (e.g. Figma
  `"Outlined"` → code `"outline"`), driven by `VALUE_NORMALIZATIONS` in the
  constants file.

## `// NOTE:` comments are intentional

Generated files may contain leading
`// NOTE: Skipped ... → no matching code prop` comments. These record Figma
properties that were deliberately not mapped because the component has no
corresponding prop. They are an accuracy record, not a TODO — don't delete them
by hand. If a NOTE is wrong (the prop does exist), fix the generator's
`KNOWN_VALID_PROPS` / `skipFigmaProps`, not the output.

## Validation

After regeneration, the generated files must pass the same gates as any other
source:

```bash
pnpm --filter @commercetools/nimbus typecheck
pnpm lint
```

Type errors here almost always mean a generation rule needs adjusting (a skipped
prop, an un-normalized value) rather than a manual fix to the `.figma.tsx`. The
repo's `figma.config.json` (at the root) configures which files Code Connect
discovers and publishes.
