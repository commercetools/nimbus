---
"@commercetools/nimbus": patch
---

`DataTable`: the per-row pin toggle button is now translated. Its accessible
name and tooltip were hardcoded English ("Pin row" / "Unpin row"), so screen
reader users in German, Spanish, French and Portuguese heard English. The new
`Nimbus.DataTable.pinRow` and `Nimbus.DataTable.unpinRow` messages will pick up
translations with the next Transifex sync.
