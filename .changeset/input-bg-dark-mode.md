---
"@commercetools/nimbus": patch
---

**TextInput, SearchInput, Combobox**: fixed the field background in dark mode.
In their default (`solid`) variant these inputs rendered a fill that was darker
than the surrounding page, making them look recessed; in light mode they nearly
disappeared into the page. Their resting background now matches the other inputs
(NumberInput, MultilineTextInput), so all fields sit consistently against the
page in both light and dark mode.
