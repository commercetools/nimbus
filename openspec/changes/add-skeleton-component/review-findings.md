# Skeleton — Review Findings (round 1)

## BLOCKING

1. **Missing documentation files** (deferred during build) — create
   `skeleton.mdx`, `skeleton.dev.mdx`, `skeleton.docs.spec.tsx`. Required per
   documentation.md + component-guidelines.md. Document the standalone (no
   `isLoaded`) usage pattern, container `aria-busy` a11y guidance, and
   reduced-motion behavior.
2. **TYPES-001/002/003** — `SkeletonTextProps` and `SkeletonCircleProps` are
   built from scratch (`= {…}`) instead of extending the Chakra slot-props
   foundation. Per the four-layer pattern, slot props are the foundation even
   for wrapper components. Both render `<div>` (SkeletonText → ChakraBox,
   SkeletonCircle → Skeleton), so they should extend `HTMLChakraProps<"div">`
   (via `OmitInternalProps<...>`) so consumers get `className`, `style`,
   standard ARIA, and event handlers. Keep the bespoke props (lines, lineHeight,
   spacing, lastLineWidth, animation / size, animation).

## SHOULD FIX

3. **TYPES-W001** — `[key: \`data-${string}\`]: string` should be `unknown`
   (matches button.types.ts:100); `string` rejects numeric data attrs like
   `data-count={5}`. Applies to all three types (or becomes moot once they
   extend HTMLChakraProps, which already includes the data-* index signature).
4. **TYPES-W002** — add a comment on `SkeletonTextProps` explaining `shape` is
   intentionally absent (text lines are always rectangle).

## NICE TO HAVE

5. **TYPES-W003** — consider exporting `SkeletonRecipeProps` (or the
   `animation` union) so consumers writing wrapper components can type the
   `animation` value. Optional for Tier 1.

## Confirmed compliant (reviewer)

- `.ts`/`.tsx` extensions, section dividers, `type` syntax, naming
  (`SkeletonRecipeProps`/`SkeletonRootSlotProps`/`SkeletonProps`), `UnstyledProp`
  in recipe props, JSDoc + `@default` on all props, ref forwarding, no
  `any`/@ts-ignore, no unnecessary React Aria, explicit variant unions justified
  with inline comment.

## Still to verify in fix step

- Recipe token usage (no raw hex/px except keyframe transforms), `_motionReduce`
  present, `defaultVariants`, className prefix.
- Stories cover all spec scenarios; displayName on all three; modular Chakra
  imports.
- After fixes: rebuild, then `pnpm test <skeleton.stories>` + `typecheck` green.
