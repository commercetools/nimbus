---
"@commercetools/nimbus": patch
---

`Avatar`: custom `children` are now rendered. The `children` prop was already
documented as "custom content to override default avatar rendering" but was
ignored; passing an icon or other node now displays it in place of the initials
/ Person fallback / image. Behavior is unchanged when `children` is omitted.
