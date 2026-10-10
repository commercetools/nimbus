---
"@commercetools/nimbus": minor
---

`ListBox`: new `isVirtualized` prop for long lists. Only the options on screen
are rendered, so a list of 500 options appears about 8 times faster; scrolling,
keyboard navigation, type-ahead and selection still reach every option. Row
heights, spacing and padding follow the list's `size` and `variant`, and rows
are measured after they render, so wrapping labels, descriptions, page zoom and
custom text spacing keep working. Tune the layout with the optional
`virtualizerOptions` prop (for example `estimatedRowHeight`, `gap`, `padding`),
typed as `VirtualizerListLayoutOptions`.

```tsx
<ListBox.Root
  isVirtualized
  aria-label="Projects"
  items={projects}
  maxHeight="20rem"
>
  {(project) => <ListBox.Item id={project.id}>{project.name}</ListBox.Item>}
</ListBox.Root>
```

Experimental. See "Long lists (virtualization)" in the
[ListBox docs](https://nimbus-documentation.vercel.app/components/inputs/list-box)
for layout options and known limitations.
