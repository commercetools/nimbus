---
"@commercetools/nimbus": patch
---

Colors: `fg.subtle` is now a semantic color token for secondary text, such as
helper text and metadata. It maps to `neutral.11` and adapts to light and dark
mode. Before, `color="fg.subtle"` rendered in the default text color (`fg`),
because the token did not exist.

Some documentation examples used `fg.muted`. This token never existed and is not
added. Use `fg.subtle` instead.

Placeholders: placeholder text in plain `<input>` and `<textarea>` elements now
renders faded, the same as in Nimbus inputs. Before, it rendered in the full
text color and looked like a typed value.
