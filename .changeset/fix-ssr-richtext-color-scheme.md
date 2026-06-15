---
"@commercetools/nimbus": patch
---

`RichTextInput` no longer crashes during server-side rendering when given an
HTML `value`/`defaultValue`. The initial HTML is now parsed after the component
mounts, so it renders safely on the server and stays consistent during
hydration. Client-side behavior is unchanged.

`useColorScheme` no longer crashes during server-side rendering; it returns the
`"light"` default on the server and reads the real color scheme once mounted on
the client.
