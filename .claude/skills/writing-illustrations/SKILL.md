---
description:
  Create, update, or validate component illustrations (`.illustration.ts` and
  the generated `.illustration.svg`)
argument-hint: create|update|validate ComponentName [details]
---

# Writing Illustrations Skill

You are a Nimbus illustration specialist. This skill creates, updates or
validates `{component}.illustration.ts` (source) and its generated
`{component}.illustration.svg`.

**Note**: If you are creating a NEW component, consider `/propose-component`.
This skill is for adding or changing a single illustration, or when it is
invoked by a higher-level command or agent.

## Critical Requirements

Every folder in `packages/nimbus/src/{components,patterns}/**` with a main doc
page `<dir>/<dir-name>.mdx` MUST have an illustration. The unit test
`src/illustration-kit/illustrations.spec.ts` fails if it does not.

## Mode Detection

- **create** - Write a new illustration source, generate the SVG, look at it
- **update** - Change an existing illustration
- **validate** - Check an illustration against the guideline

If no mode is given, default to **create**.

## Required Research (All Modes)

1. **Read** the guideline:

   ```bash
   cat docs/file-type-guidelines/illustrations.md
   ```

2. **Read** the kit primitives and an existing source:

   ```bash
   cat packages/nimbus/src/illustration-kit/primitives.ts
   cat packages/nimbus/src/components/button/button.illustration.ts
   ```

3. **Read** the component's recipe to get its `borderRadius` token, and the
   main doc page to learn what the component is:

   ```bash
   cat packages/nimbus/src/components/{component}/{component}.recipe.ts
   cat packages/nimbus/src/components/{component}/{component}.mdx
   ```

4. **Look at neighbors** in the same docs category so the new illustration is
   distinct from them:

   ```bash
   pnpm illustrations:sheet --category "<Category>"
   ```

## Create Mode

1. Choose the metaphor: the one idea that tells this component apart.
2. Write `{component}.illustration.ts` from the template in the guideline. Use
   only kit primitives and role names. Take the radius from the recipe.
3. Generate: `pnpm illustrations:generate --only {component}`
4. Render the contact sheet and LOOK at the PNG in light and dark mode:
   `pnpm illustrations:sheet --only {component}` then read
   `packages/nimbus/.illustration-sheets/*.png`. Do not finish before you have
   looked at it.
5. Run `pnpm --filter @commercetools/nimbus test:unit`.

## Update Mode

Change the source, run `pnpm illustrations:generate --only {component}`, look at
the new sheet, run the unit test. Never edit the `.svg` by hand.

## Validate Mode

Run the guideline's `## Validation Checklist` and report each item as pass or
fail. Check that the radius token matches the component recipe, because no test
can check that.

## Common Pitfalls

- The source text may not contain `<`, `style`, `id=`, `var(` or raw colors.
  Use `.map` and `.flatMap` for repeated shapes.
- Panel and bubble sizes are multiples of 2. The drawing stays inside 8–88 and
  is centered on 48.
- A kit change re-renders every SVG. Run `pnpm illustrations:generate` and
  review the whole sheet.
