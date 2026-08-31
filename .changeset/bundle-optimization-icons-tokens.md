---
"@commercetools/nimbus": minor
"@commercetools/nimbus-icons": patch
---

`@commercetools/nimbus-icons` and `@commercetools/nimbus-tokens` are no longer
required peer dependencies. Nimbus now bundles the icons and tokens it uses
internally, so consumers only need to install `@chakra-ui/react` and `react` as
peers.

- Consumers who import icons directly from `@commercetools/nimbus-icons` for
  their own UI should keep it as a regular dependency — it continues to work
  independently and now tree-shakes correctly.
- Consumers who only had `nimbus-icons` and `nimbus-tokens` installed because
  nimbus required them can remove both packages.

`@commercetools/nimbus-icons`: fixed tree-shaking — bundlers now correctly
eliminate unused icons instead of including all 2,000+.
