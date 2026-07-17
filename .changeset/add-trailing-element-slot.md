---
"@commercetools/nimbus": minor
---

**ComboBox, Select, SearchInput**: add `trailingElement` prop — an optional node
rendered at the far trailing edge of the field, after any built-in trailing
controls (clear button, toggle/chevron indicator).

This brings the three components in line with `TextInput`, which already
supports `trailingElement`. Use it for unit suffixes ("kg", "%"), inline status
icons, or secondary actions next to the field.

```tsx
<SearchInput trailingElement={<Text color="fg.muted">kg</Text>} />
<Select.Root trailingElement={<Text color="fg.muted">kg</Text>}>...</Select.Root>
<ComboBox.Root trailingElement={<Text color="fg.muted">kg</Text>}>...</ComboBox.Root>
```

This is additive and non-breaking — omitting the prop renders exactly as before.
