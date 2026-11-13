# Tasks

## 1. LoadingSpinner as a single svg

- [x] 1.1 Render the spinner as one `svg` root (slot, types, component, recipe) with a 24px attribute fallback and no default size variant; verify `pnpm test:dev packages/nimbus/src/components/loading-spinner/loading-spinner.stories.tsx` passes
- [x] 1.2 Add the stories `RendersAtRequestedSize` and `NextToIconsInButtons`; verify they assert 14/20/24/32/40px for the five sizes, 24px without size, and the button icon size inside buttons of every size
- [x] 1.3 Draw the ring on whole pixels (radius 9, stroke 2, pointer path `M12 3A9 9 0 0 1 21 12`); verify the stories above still pass
- [x] 1.4 Add the changeset `.changeset/safari-spinner-table-overflow.md` (`patch`) with the `ref` type, the button icon size, the patterns and the thinner stroke; verify `pnpm changeset:status` lists `@commercetools/nimbus`
- [x] 1.5 Update `loading-spinner.dev.mdx` ("`sm` (default)" in the sizes section) to say that without `size` the spinner takes the icon size of its parent and is 24px elsewhere; verify the text matches the "No size specified" scenario in the spec
- [x] 1.6 Check the `.docs.spec.tsx`, `.guidelines.mdx` and `.a11y.mdx` files of the spinner for statements about the `div`, the default size, `ml`/`size` in buttons or the `ref` type; verify with `rg -n "div|default|HTMLDivElement|ml=" packages/nimbus/src/components/loading-spinner/*.mdx` and fix any hit

## 2. Patterns and DataTable

- [x] 2.1 Use `<LoadingSpinner />` without `size` and margin in `FormActionBar`, `ConfirmationDialog` and `FormDialog`; verify `pnpm test:dev` for the three pattern stories passes
- [x] 2.2 Add `&:last-child .nimbus-data-table__columnResizer { right: 0 }` and the story `LastColumnResizerStaysInsideTable`; verify the story passes and that it shows no horizontal scroll

## 3. Specs and verification

- [ ] 3.1 Run `pnpm exec openspec validate render-loading-spinner-as-svg --strict`; verify it reports no errors for the four delta specs
- [ ] 3.2 Open the loading spinner in Safari (Storybook `Sizes` and `NextToIconsInButtons`); verify the five sizes differ and a spinner in a button matches the icon next to it. The change was only tested in headless Chromium
- [ ] 3.3 Ask design to check the thinner ring (2px, was 2.5px at 24px) in the Chromatic snapshot of `ColorPalettes`; verify the approval is recorded in PR #2165
- [ ] 3.4 Update the "After" screenshots in the PR description for the new geometry; verify the images show the 2px ring

## Workflow follow-up

- Archive this change after PR #2165 is merged, so the delta specs replace the
  outdated `nimbus-loading-spinner` requirements (`/opsx:archive`).
