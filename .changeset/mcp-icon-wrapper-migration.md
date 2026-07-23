---
"@commercetools/nimbus-mcp": minor
---

`migrate_from_uikit`: Icon migration responses now include an `iconWrapper`
field with the `Icon` wrapper component, its import path, default size/color
props, and a UIKit-to-Nimbus size mapping (deprecated aliases `small`→`2xs`,
`medium`→`xs`, `big`→`md` and numeric sizes `10`→`2xs`, `20`→`xs`, `30`→`sm`,
`40`→`md`). This ensures migrated icons use `<Icon as={SvgName} />` with proper
design-system sizing and color tokens instead of bare icon components.
