---
"@commercetools/nimbus": minor
---

**randomSystemColorPalette** (Beta): derive a stable color palette from any
string.

New utility that maps a seed string (a user id, name, tag, category, …) to one
of the system color palettes. The mapping is deterministic — the same seed
always returns the same palette across renders, reloads, and machines — so you
can give entities a consistent, random-looking color without storing one.

Ships as **Beta**: usable now, but the API and color mapping may still change in
a future release.

```tsx
import { randomSystemColorPalette } from "@commercetools/nimbus";

<Avatar colorPalette={randomSystemColorPalette(user.id)} />;
```

Also exports the `SystemColorPalette` type (the union of system palette names)
for typing your own helpers.
