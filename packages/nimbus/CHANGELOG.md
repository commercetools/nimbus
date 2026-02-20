# @commercetools/nimbus

## 2.7.0

### Minor Changes

- [#1096](https://github.com/commercetools/nimbus/pull/1096)
  [`6cc65e2`](https://github.com/commercetools/nimbus/commit/6cc65e22a2997eeeabeff6b8d488ac846fe475eb)
  Thanks [@tylermorrisford](https://github.com/tylermorrisford)! - Allows for
  programmatically expanding nested rows in the DataTable component.

### Patch Changes

- [#1104](https://github.com/commercetools/nimbus/pull/1104)
  [`6566e21`](https://github.com/commercetools/nimbus/commit/6566e21235f6a953d958ad85396d7efa47cd31aa)
  Thanks [@misama-ct](https://github.com/misama-ct)! - FormField: fix error icon
  shrinking on multiline error messages

- Updated dependencies []:
  - @commercetools/nimbus-tokens@2.7.0
  - @commercetools/nimbus-icons@2.7.0

## 2.6.0

### Minor Changes

- [#1005](https://github.com/commercetools/nimbus/pull/1005)
  [`91baca2`](https://github.com/commercetools/nimbus/commit/91baca2d3f8a15b0dd5b6bc09635d768b0f0da9d)
  Thanks [@jaikamat](https://github.com/jaikamat)! - Created Steps component and
  relevant documentation

- [#1064](https://github.com/commercetools/nimbus/pull/1064)
  [`a030c8e`](https://github.com/commercetools/nimbus/commit/a030c8e2e5b0c18231b7078039dfdfa71a13ea6b)
  Thanks [@ByronDWall](https://github.com/ByronDWall)! - Adds new
  @commercetools/nimbus-design-token-ts-plugin package to enable displaying the
  css value of design tokens in ts intellisense autocomplete. For example, when
  you type `gap="`, the dropdown shows `600 = 24px` instead of just `600`. Also
  adds documentation for how to install and use this package in the typescript
  support section of the nimbus installation guide -
  https://nimbus-documentation.vercel.app/home/getting-started/installation#typescript-support

- [#965](https://github.com/commercetools/nimbus/pull/965)
  [`d582980`](https://github.com/commercetools/nimbus/commit/d5829808d61cec1ba62ce2da81dbeb139a9e2b40)
  Thanks [@misama-ct](https://github.com/misama-ct)! - Remove disabled state
  from Avatar component

### Patch Changes

- [#1065](https://github.com/commercetools/nimbus/pull/1065)
  [`337e92f`](https://github.com/commercetools/nimbus/commit/337e92f7c8e0e3163f707b2445b01f565cb35546)
  Thanks [@ByronDWall](https://github.com/ByronDWall)! - Updated parent
  DataTableBase component to be a generic function that accepts the user's row
  data type, enabling type inference on data table rows.

- [#1052](https://github.com/commercetools/nimbus/pull/1052)
  [`d26bb99`](https://github.com/commercetools/nimbus/commit/d26bb995a1637b75317cf07d49e47c2bcd070299)
  Thanks [@ByronDWall](https://github.com/ByronDWall)! - DataTable "pin row"
  cell now renders dark background in dark mode. Tooltip now renders dark text
  on light background in dark mode.

- [#1082](https://github.com/commercetools/nimbus/pull/1082)
  [`77a822d`](https://github.com/commercetools/nimbus/commit/77a822d162ed880d43508593b203525eaee75999)
  Thanks [@ByronDWall](https://github.com/ByronDWall)! - NumberInput: prevent
  value from overflowing input when width is constrained

- [#1082](https://github.com/commercetools/nimbus/pull/1082)
  [`77a822d`](https://github.com/commercetools/nimbus/commit/77a822d162ed880d43508593b203525eaee75999)
  Thanks [@ByronDWall](https://github.com/ByronDWall)! - Button: Fixes a bug
  where Button event handlers (onClick, onPress, onFocus, onBlur) fired twice
  per interaction.

- [#1053](https://github.com/commercetools/nimbus/pull/1053)
  [`2fb0433`](https://github.com/commercetools/nimbus/commit/2fb04339775a348fc687a730b5f01af4a8f12686)
  Thanks [@stephsprinkle](https://github.com/stephsprinkle)! - Removed internal
  `DataTable` components from public API.

- Updated dependencies
  [[`b436bf8`](https://github.com/commercetools/nimbus/commit/b436bf80954f6e8913f92f0c67d6e4c1fe93fc07)]:
  - @commercetools/nimbus-icons@2.6.0
  - @commercetools/nimbus-tokens@2.6.0

## 2.5.0

### Minor Changes

- [#987](https://github.com/commercetools/nimbus/pull/987)
  [`53b01dc`](https://github.com/commercetools/nimbus/commit/53b01dcda7f82503a716ef5ddac4e298924972de)
  Thanks [@valoriecarli](https://github.com/valoriecarli)! - Remove react-intl
  dev dependency and replace with custom message extraction script.

### Patch Changes

- [#998](https://github.com/commercetools/nimbus/pull/998)
  [`a0db354`](https://github.com/commercetools/nimbus/commit/a0db3545adfeb6cbedfe0b82cfaeea7692974a99)
  Thanks [@jaikamat](https://github.com/jaikamat)! - Support type-generation
  experience for consumers

- Updated dependencies []:
  - @commercetools/nimbus-tokens@2.5.0
  - @commercetools/nimbus-icons@2.5.0

## 2.4.0

### Minor Changes

- [#982](https://github.com/commercetools/nimbus/pull/982)
  [`bb6189a`](https://github.com/commercetools/nimbus/commit/bb6189a8c03bc0c49ab74816be52ef3c4711ed6d)
  Thanks [@jaikamat](https://github.com/jaikamat)! - Prefixed 22 Nimbus recipe
  keys with nimbus to avoid collisions with Chakra's built-in recipe names,
  ensuring consumer apps see Nimbus's custom type values instead of Chakra's
  defaults.

### Patch Changes

- [#942](https://github.com/commercetools/nimbus/pull/942)
  [`2759847`](https://github.com/commercetools/nimbus/commit/27598479f500335dc7046b235eec304850be8031)
  Thanks [@misama-ct](https://github.com/misama-ct)! - fix(DateRangePicker):
  restore ghost variant styling

- Updated dependencies []:
  - @commercetools/nimbus-tokens@2.4.0
  - @commercetools/nimbus-icons@2.4.0

## 2.3.1

### Patch Changes

- [#946](https://github.com/commercetools/nimbus/pull/946)
  [`b458b3f`](https://github.com/commercetools/nimbus/commit/b458b3fca5b3a5e819ed38ec70b912246c082abe)
  Thanks [@jaikamat](https://github.com/jaikamat)! - Fixed Jest CommonJS module
  resolution for Flex and Table components by replacing Chakra UI subpath
  re-exports with custom wrapper implementations.
- Updated dependencies []:
  - @commercetools/nimbus-tokens@2.3.1
  - @commercetools/nimbus-icons@2.3.1

## 2.3.0

### Minor Changes

- [#921](https://github.com/commercetools/nimbus/pull/921)
  [`060f534`](https://github.com/commercetools/nimbus/commit/060f534ac1ade0001255689b0c3e7558cc7ebb48)
  Thanks [@misama-ct](https://github.com/misama-ct)! - Add `tabListAriaLabel`
  prop to Tabs component for improved accessibility

### Patch Changes

- [#921](https://github.com/commercetools/nimbus/pull/921)
  [`060f534`](https://github.com/commercetools/nimbus/commit/060f534ac1ade0001255689b0c3e7558cc7ebb48)
  Thanks [@misama-ct](https://github.com/misama-ct)! - Add default aria-labels
  to DataTable.Table, DataTable.Header, and DataTable.Body components for
  improved accessibility

- [#944](https://github.com/commercetools/nimbus/pull/944)
  [`5afd39d`](https://github.com/commercetools/nimbus/commit/5afd39debd8bba3c030297eb913a3491a25c2545)
  Thanks [@jaikamat](https://github.com/jaikamat)! - Fix missing
  window.matchMedia polyfill in built setup-jsdom-polyfills output

- Updated dependencies []:
  - @commercetools/nimbus-tokens@2.3.0
  - @commercetools/nimbus-icons@2.3.0

## 2.2.0

### Minor Changes

- [#732](https://github.com/commercetools/nimbus/pull/732)
  [`f9d25d6`](https://github.com/commercetools/nimbus/commit/f9d25d63692b0854aca6a6633f3674274a4e1d09)
  Thanks [@valoriecarli](https://github.com/valoriecarli)! - Update minor
  versions of tooling dependencies

- [#630](https://github.com/commercetools/nimbus/pull/630)
  [`dcf5f6f`](https://github.com/commercetools/nimbus/commit/dcf5f6f197f9c8a71dad284ddb88d8cece70de83)
  Thanks [@ByronDWall](https://github.com/ByronDWall)! - Update Combobox to new
  context-based architecture and add missing features.

- [#713](https://github.com/commercetools/nimbus/pull/713)
  [`fc7515a`](https://github.com/commercetools/nimbus/commit/fc7515a7e92ff397523c6050a4bd1b5882ff4528)
  Thanks [@valoriecarli](https://github.com/valoriecarli)! - Introduced
  SearchInputField component with supplemental guideline and engineering
  documentation.

- [#841](https://github.com/commercetools/nimbus/pull/841)
  [`0fe5368`](https://github.com/commercetools/nimbus/commit/0fe5368ec8b097aa961b7f8a53251fd24dda35a4)
  Thanks [@valoriecarli](https://github.com/valoriecarli)! - Components now use
  `useLocalizedStringFormatter` with pre-compiled message dictionaries instead
  of runtime `react-intl` parsing.

### Patch Changes

- [#842](https://github.com/commercetools/nimbus/pull/842)
  [`421ed44`](https://github.com/commercetools/nimbus/commit/421ed44d4dd5b11b8879edbe3a1c74654c09115e)
  Thanks [@ByronDWall](https://github.com/ByronDWall)! - Ensure
  `FormField.Label`'s required asterisk is always aligned to the top right

- [#612](https://github.com/commercetools/nimbus/pull/612)
  [`f92fb51`](https://github.com/commercetools/nimbus/commit/f92fb515479f0565429f8bbfc0749f2aea5fbc12)
  Thanks [@misama-ct](https://github.com/misama-ct)! - Update
  DateRangePickerField types

- [#690](https://github.com/commercetools/nimbus/pull/690)
  [`5ce31d4`](https://github.com/commercetools/nimbus/commit/5ce31d469aacd11a40738ea00dbd111cd5cc3eb5)
  Thanks [@ByronDWall](https://github.com/ByronDWall)! - Update `colors.bg`
  semantic css value to use `colors.neutral.1` and `colors.fg` to use
  `colors.neutral.12` instead of setting them as `black` and `white`

- [#648](https://github.com/commercetools/nimbus/pull/648)
  [`3dca992`](https://github.com/commercetools/nimbus/commit/3dca992703186af8c45a57ed16402f19bb8cfd5f)
  Thanks [@ByronDWall](https://github.com/ByronDWall)! - Fix cross-chunk
  circular dependencies by importing directly from implementation files

  Previously, components importing from other components' barrel exports
  (index.ts) created circular chunk dependencies during the build process. This
  has been fixed by updating all cross-component imports to import directly from
  implementation files (e.g., `button.tsx`, `button.types.ts`) instead of barrel
  exports.

  Changes:
  - Updated 29 cross-component imports across 15 files in components and
    patterns directories
  - Added comprehensive documentation about the cross-chunk import pattern in
    docs/component-guidelines.md and docs/file-type-guidelines/main-component.md
  - Clarified vite.config.ts warning suppression to specifically target
    intentional compound component barrel export patterns
  - Added inline documentation in vite.config.ts explaining the relationship
    between build configuration and import requirements

  This change prevents potential circular dependency warnings, ensures
  predictable module initialization order, and maintains optimal code splitting
  behavior.

- [#683](https://github.com/commercetools/nimbus/pull/683)
  [`2807ffe`](https://github.com/commercetools/nimbus/commit/2807ffe14e5287eaace93622cca71c719bd27884)
  Thanks [@jaikamat](https://github.com/jaikamat)! - Create NumberInputField

- [#664](https://github.com/commercetools/nimbus/pull/664)
  [`7fb5136`](https://github.com/commercetools/nimbus/commit/7fb5136ce4748e35aa5fbe4fa6a35664d7ab6b63)
  Thanks [@misama-ct](https://github.com/misama-ct)! - removed unnecessary
  tabIndex property from Card

- [#655](https://github.com/commercetools/nimbus/pull/655)
  [`bf19ab6`](https://github.com/commercetools/nimbus/commit/bf19ab6376c825292a1a7584afd943412e09f080)
  Thanks [@misama-ct](https://github.com/misama-ct)! - fix an issue with card
  backgrounds in dark-mode

- [#693](https://github.com/commercetools/nimbus/pull/693)
  [`23a7c3f`](https://github.com/commercetools/nimbus/commit/23a7c3fd10efea25194e5826d16cf3f02d0dc264)
  Thanks [@jaikamat](https://github.com/jaikamat)! - Change internal layout
  strategy of Alert component

- [#649](https://github.com/commercetools/nimbus/pull/649)
  [`edc52bd`](https://github.com/commercetools/nimbus/commit/edc52bd01e948d450cfca9a7514e779b06acb28d)
  Thanks [@valoriecarli](https://github.com/valoriecarli)! - Update docs image
  for TagGroup in use.

- Updated dependencies
  [[`f92fb51`](https://github.com/commercetools/nimbus/commit/f92fb515479f0565429f8bbfc0749f2aea5fbc12),
  [`f9d25d6`](https://github.com/commercetools/nimbus/commit/f9d25d63692b0854aca6a6633f3674274a4e1d09),
  [`04a8510`](https://github.com/commercetools/nimbus/commit/04a8510051585cfa67dcf64e141bccce6749d625)]:
  - @commercetools/nimbus-icons@2.2.0
  - @commercetools/nimbus-tokens@2.2.0

## 2.1.0

### Minor Changes

- [#531](https://github.com/commercetools/nimbus/pull/531)
  [`3312d94`](https://github.com/commercetools/nimbus/commit/3312d945d07ba79bdd79594f63accda3e81fe336)
  Thanks [@ddouglasz](https://github.com/ddouglasz)! - implement data table
  manager design and functionality.

- [#563](https://github.com/commercetools/nimbus/pull/563)
  [`5cc6790`](https://github.com/commercetools/nimbus/commit/5cc6790b12218c96b94e5c6bff71d9c4c2b2d75d)
  Thanks [@valoriecarli](https://github.com/valoriecarli)! - Add IntlProvider to
  NimbusProvider

- [#547](https://github.com/commercetools/nimbus/pull/547)
  [`205af3a`](https://github.com/commercetools/nimbus/commit/205af3a3eebfbc4a0bbcf990fc13cea56a0fc178)
  Thanks [@ByronDWall](https://github.com/ByronDWall)! - Stop packaging slate,
  slate-hyperscript, slate-history, and slate-react in nimbus directly, and
  specify them as peer dependencies instead

- [#520](https://github.com/commercetools/nimbus/pull/520)
  [`77ee9f2`](https://github.com/commercetools/nimbus/commit/77ee9f2888d84c921fc54486cdf1ce7b8233ad6b)
  Thanks [@valoriecarli](https://github.com/valoriecarli)! - Added a
  TextInputField pattern component - a pre-composed field that integrates
  TextInput with FormField for common use cases.

### Patch Changes

- [#577](https://github.com/commercetools/nimbus/pull/577)
  [`f83b57f`](https://github.com/commercetools/nimbus/commit/f83b57f4c4378c2c0928bad0681441d342a3a1a8)
  Thanks [@ByronDWall](https://github.com/ByronDWall)! - Add patterns directory
  to package entrypoint

- [#579](https://github.com/commercetools/nimbus/pull/579)
  [`ef90e9c`](https://github.com/commercetools/nimbus/commit/ef90e9c284c3db3dafe830ac4f9258edcafd8bdd)
  Thanks [@ByronDWall](https://github.com/ByronDWall)! - Fixes bug in
  DraggableList where list does not update when external items array changes

- [#536](https://github.com/commercetools/nimbus/pull/536)
  [`29cc2d7`](https://github.com/commercetools/nimbus/commit/29cc2d77a954a15ed64ae6947764690c36ae852b)
  Thanks [@misama-ct](https://github.com/misama-ct)! - Introduce grouped props
  tables and enhanced JSDoc documentation system

- [#620](https://github.com/commercetools/nimbus/pull/620)
  [`7e31d53`](https://github.com/commercetools/nimbus/commit/7e31d53eeb38307bb4fba3559850072cd44b80be)
  Thanks [@misama-ct](https://github.com/misama-ct)! - removed unnecessary
  tabIndex property from Card

- [#598](https://github.com/commercetools/nimbus/pull/598)
  [`bc4a92e`](https://github.com/commercetools/nimbus/commit/bc4a92e731d82f6d81e95d0622a040b7fca83f88)
  Thanks [@ByronDWall](https://github.com/ByronDWall)! - TextInput now consumes
  react-aria's InputContext, Button consumes isDisabled from context

- [#636](https://github.com/commercetools/nimbus/pull/636)
  [`3caf3ed`](https://github.com/commercetools/nimbus/commit/3caf3ed62e1c73a9bfdd9a060f97b9bdc1d0b310)
  Thanks [@tylermorrisford](https://github.com/tylermorrisford)! - Introduces
  the date-range-picker-field as a composed, happy-path component.

- [#637](https://github.com/commercetools/nimbus/pull/637)
  [`53882a2`](https://github.com/commercetools/nimbus/commit/53882a200ca72600f35ee5f06a7d1f64b5471082)
  Thanks [@tylermorrisford](https://github.com/tylermorrisford)! - Update
  changeset configuration to prevent unnecessary major version bumps

- [#643](https://github.com/commercetools/nimbus/pull/643)
  [`42124ce`](https://github.com/commercetools/nimbus/commit/42124cedaa62526de6a0eac3744486f00f416e66)
  Thanks [@tylermorrisford](https://github.com/tylermorrisford)! - Changes the
  designated changeset github action and includes the PR title in the release
  workflow.
- Updated dependencies
  [[`42124ce`](https://github.com/commercetools/nimbus/commit/42124cedaa62526de6a0eac3744486f00f416e66)]:
  - @commercetools/nimbus-icons@2.1.0
  - @commercetools/nimbus-tokens@2.1.0

## 2.0.1

### Patch Changes

- [#543](https://github.com/commercetools/nimbus/pull/543)
  [`d20c689`](https://github.com/commercetools/nimbus/commit/d20c68922d99d2f97a0c2fcaebd1e1a8c7101523)
  Thanks [@ByronDWall](https://github.com/ByronDWall)! - Updates vite type
  resolution settings to colocate types with component code in `/dist`. Ensures
  all utility types are exported in `/dist`. Removes all file extensions from
  exported file paths in indexes for proper type resolution.
- Updated dependencies []:
  - @commercetools/nimbus-tokens@2.0.1
  - @commercetools/nimbus-icons@2.0.1

## 2.0.0

### Minor Changes

- [#454](https://github.com/commercetools/nimbus/pull/454)
  [`5544175`](https://github.com/commercetools/nimbus/commit/5544175895bb994a2fae174cdc471755f27a6ea8)
  Thanks [@valoriecarli](https://github.com/valoriecarli)! - Add the DateInput
  component to the documentation.

- [#416](https://github.com/commercetools/nimbus/pull/416)
  [`1e9f91c`](https://github.com/commercetools/nimbus/commit/1e9f91c90cd69443ae728bdb73449de4be52e930)
  Thanks [@ByronDWall](https://github.com/ByronDWall)! - Nimbus components - add
  LocalizedField component

- [#528](https://github.com/commercetools/nimbus/pull/528)
  [`54af439`](https://github.com/commercetools/nimbus/commit/54af439afd6feb1ff0bb960eeb891966c785fdd8)
  Thanks [@misama-ct](https://github.com/misama-ct)! - Spacer component added

- [#488](https://github.com/commercetools/nimbus/pull/488)
  [`5d306d5`](https://github.com/commercetools/nimbus/commit/5d306d594c178be29d0ec2f88f0c4d0baf22233c)
  Thanks [@jaikamat](https://github.com/jaikamat)! - Create ScopedSearchInput
  component

- [#428](https://github.com/commercetools/nimbus/pull/428)
  [`345c857`](https://github.com/commercetools/nimbus/commit/345c85757e11e7a852fed80aeaa547ca1a12af0c)
  Thanks [@misama-ct](https://github.com/misama-ct)! - Dialog component added

- [#477](https://github.com/commercetools/nimbus/pull/477)
  [`02d2f67`](https://github.com/commercetools/nimbus/commit/02d2f67f6d0fa9583d6c0cf4133ec1cf65521780)
  Thanks [@jaikamat](https://github.com/jaikamat)! - create SearchInput
  component

- [#436](https://github.com/commercetools/nimbus/pull/436)
  [`3810148`](https://github.com/commercetools/nimbus/commit/3810148a76d6cf740656c26ca3be057c7952c296)
  Thanks [@jaikamat](https://github.com/jaikamat)! - Create MoneyInput component
  and component custom icon

- [#476](https://github.com/commercetools/nimbus/pull/476)
  [`2b6a44c`](https://github.com/commercetools/nimbus/commit/2b6a44ca3e3c6283e6a54af4dd28cd95120f2d45)
  Thanks [@misama-ct](https://github.com/misama-ct)! - Drawer component added

- [#382](https://github.com/commercetools/nimbus/pull/382)
  [`014f9be`](https://github.com/commercetools/nimbus/commit/014f9be6ec4decb47e249f2d1c5e7f643815540f)
  Thanks [@misama-ct](https://github.com/misama-ct)! - InlineSvg component added

- [#522](https://github.com/commercetools/nimbus/pull/522)
  [`3dcb211`](https://github.com/commercetools/nimbus/commit/3dcb211a0408725add9fc60d9013a4d65b2b2448)
  Thanks [@valoriecarli](https://github.com/valoriecarli)! - Updated Nimbus and
  i18n package readme files

### Patch Changes

- [#439](https://github.com/commercetools/nimbus/pull/439)
  [`ffe580f`](https://github.com/commercetools/nimbus/commit/ffe580f75ba2b73c1c9888c7a9ec9b8124a6e40c)
  Thanks [@valoriecarli](https://github.com/valoriecarli)! - Added IntlProvider
  wrapper to docs

- [#539](https://github.com/commercetools/nimbus/pull/539)
  [`31eab19`](https://github.com/commercetools/nimbus/commit/31eab192f4b4b024e08fc89ccfdce87d6aa98a50)
  Thanks [@valoriecarli](https://github.com/valoriecarli)! - Corrected remaining
  i18n package naming references

- [#501](https://github.com/commercetools/nimbus/pull/501)
  [`978c92c`](https://github.com/commercetools/nimbus/commit/978c92c456aea7f2d714709e8f5c178ea5d4d0ce)
  Thanks [@ByronDWall](https://github.com/ByronDWall)! - Adds the DraggableList
  component

- [#461](https://github.com/commercetools/nimbus/pull/461)
  [`ddf0e14`](https://github.com/commercetools/nimbus/commit/ddf0e14ceb1e48b8b26346f57de7e62871c37642)
  Thanks [@valoriecarli](https://github.com/valoriecarli)! - Update Calendar
  documentation.

- [#500](https://github.com/commercetools/nimbus/pull/500)
  [`4ec20b7`](https://github.com/commercetools/nimbus/commit/4ec20b7832c53f1c2dbd9895da7ef275f5c311b7)
  Thanks [@valoriecarli](https://github.com/valoriecarli)! - Update image for
  Calendar docs.

- [#460](https://github.com/commercetools/nimbus/pull/460)
  [`a64a858`](https://github.com/commercetools/nimbus/commit/a64a858498592264e3bf00a3467f366bf17fe30d)
  Thanks [@jaikamat](https://github.com/jaikamat)! - create CollapsibleMotion
  component

- [#519](https://github.com/commercetools/nimbus/pull/519)
  [`3f078e6`](https://github.com/commercetools/nimbus/commit/3f078e642244e3c4333f24bc5f8a027f4e8d3e3f)
  Thanks [@dependabot](https://github.com/apps/dependabot)! - Update react-intl
  to v7.1.14, add it as dev dependency to nimbus package, make peer dep only 7.x
  instead of specific version"
- Updated dependencies
  [[`3810148`](https://github.com/commercetools/nimbus/commit/3810148a76d6cf740656c26ca3be057c7952c296),
  [`90d6d2a`](https://github.com/commercetools/nimbus/commit/90d6d2af786e697e2f2f6bbbb11c93159105837a)]:
  - @commercetools/nimbus-icons@2.0.0
  - @commercetools/nimbus-tokens@2.0.0

## 1.0.1

### Minor Changes

- [#320](https://github.com/commercetools/nimbus/pull/320)
  [`70dd712`](https://github.com/commercetools/nimbus/commit/70dd712e468534f9f365b0e53e14aa778986c663)
  Thanks [@jaikamat](https://github.com/jaikamat)! - Created SplitButton
  component

- [#309](https://github.com/commercetools/nimbus/pull/309)
  [`c1720ff`](https://github.com/commercetools/nimbus/commit/c1720ffd2cda7868e8a8d94fc435ed7b251ce32e)
  Thanks [@valoriecarli](https://github.com/valoriecarli)! - Update clear button
  logic for `DatePicker` & `DateRangePicker`

### Patch Changes

- [#314](https://github.com/commercetools/nimbus/pull/314)
  [`7819b65`](https://github.com/commercetools/nimbus/commit/7819b65a9f6259e87f572feb80b87a1b72c0d425)
  Thanks [@jaikamat](https://github.com/jaikamat)! - Testing

- [#312](https://github.com/commercetools/nimbus/pull/312)
  [`f3ad4b0`](https://github.com/commercetools/nimbus/commit/f3ad4b03a6ef8f6b148a00656498c7fb84d724c3)
  Thanks [@jaikamat](https://github.com/jaikamat)! - Testing versioning

- [#313](https://github.com/commercetools/nimbus/pull/313)
  [`6377be1`](https://github.com/commercetools/nimbus/commit/6377be12ca25c9df6aec37d6bd676f8a740ddfb9)
  Thanks [@jaikamat](https://github.com/jaikamat)! - Testing

- [#377](https://github.com/commercetools/nimbus/pull/377)
  [`8fcebaf`](https://github.com/commercetools/nimbus/commit/8fcebaf54e70da3fa68b576d85e9973f7ff814e1)
  Thanks [@ByronDWall](https://github.com/ByronDWall)! - Update build step to
  handle multiple chakra-ui entrypoints as peer dependencies instead of
  erroneously including them in the build

- [#312](https://github.com/commercetools/nimbus/pull/312)
  [`f3ad4b0`](https://github.com/commercetools/nimbus/commit/f3ad4b03a6ef8f6b148a00656498c7fb84d724c3)
  Thanks [@jaikamat](https://github.com/jaikamat)! - Testing versioning

- [#331](https://github.com/commercetools/nimbus/pull/331)
  [`1557b64`](https://github.com/commercetools/nimbus/commit/1557b648bd54433129b69c8d27bed7bc228131d7)
  Thanks [@jaikamat](https://github.com/jaikamat)! - Created RichTextInput
  component

- Updated dependencies
  [[`7819b65`](https://github.com/commercetools/nimbus/commit/7819b65a9f6259e87f572feb80b87a1b72c0d425),
  [`f3ad4b0`](https://github.com/commercetools/nimbus/commit/f3ad4b03a6ef8f6b148a00656498c7fb84d724c3),
  [`6377be1`](https://github.com/commercetools/nimbus/commit/6377be12ca25c9df6aec37d6bd676f8a740ddfb9),
  [`f3ad4b0`](https://github.com/commercetools/nimbus/commit/f3ad4b03a6ef8f6b148a00656498c7fb84d724c3)]:
  - @commercetools/nimbus-icons@1.0.1
  - @commercetools/nimbus-tokens@1.0.1

## 1.0.0

### Minor Changes

- [#320](https://github.com/commercetools/nimbus/pull/320)
  [`70dd712`](https://github.com/commercetools/nimbus/commit/70dd712e468534f9f365b0e53e14aa778986c663)
  Thanks [@jaikamat](https://github.com/jaikamat)! - Created SplitButton
  component

- [#309](https://github.com/commercetools/nimbus/pull/309)
  [`c1720ff`](https://github.com/commercetools/nimbus/commit/c1720ffd2cda7868e8a8d94fc435ed7b251ce32e)
  Thanks [@valoriecarli](https://github.com/valoriecarli)! - Update clear button
  logic for `DatePicker` & `DateRangePicker`

### Patch Changes

- [#314](https://github.com/commercetools/nimbus/pull/314)
  [`7819b65`](https://github.com/commercetools/nimbus/commit/7819b65a9f6259e87f572feb80b87a1b72c0d425)
  Thanks [@jaikamat](https://github.com/jaikamat)! - Testing

- [#312](https://github.com/commercetools/nimbus/pull/312)
  [`f3ad4b0`](https://github.com/commercetools/nimbus/commit/f3ad4b03a6ef8f6b148a00656498c7fb84d724c3)
  Thanks [@jaikamat](https://github.com/jaikamat)! - Testing versioning

- [#313](https://github.com/commercetools/nimbus/pull/313)
  [`6377be1`](https://github.com/commercetools/nimbus/commit/6377be12ca25c9df6aec37d6bd676f8a740ddfb9)
  Thanks [@jaikamat](https://github.com/jaikamat)! - Testing

- [#377](https://github.com/commercetools/nimbus/pull/377)
  [`8fcebaf`](https://github.com/commercetools/nimbus/commit/8fcebaf54e70da3fa68b576d85e9973f7ff814e1)
  Thanks [@ByronDWall](https://github.com/ByronDWall)! - Update build step to
  handle multiple chakra-ui entrypoints as peer dependencies instead of
  erroneously including them in the build

- [#312](https://github.com/commercetools/nimbus/pull/312)
  [`f3ad4b0`](https://github.com/commercetools/nimbus/commit/f3ad4b03a6ef8f6b148a00656498c7fb84d724c3)
  Thanks [@jaikamat](https://github.com/jaikamat)! - Testing versioning

- [#331](https://github.com/commercetools/nimbus/pull/331)
  [`1557b64`](https://github.com/commercetools/nimbus/commit/1557b648bd54433129b69c8d27bed7bc228131d7)
  Thanks [@jaikamat](https://github.com/jaikamat)! - Created RichTextInput
  component

- Updated dependencies
  [[`7819b65`](https://github.com/commercetools/nimbus/commit/7819b65a9f6259e87f572feb80b87a1b72c0d425),
  [`f3ad4b0`](https://github.com/commercetools/nimbus/commit/f3ad4b03a6ef8f6b148a00656498c7fb84d724c3),
  [`6377be1`](https://github.com/commercetools/nimbus/commit/6377be12ca25c9df6aec37d6bd676f8a740ddfb9),
  [`f3ad4b0`](https://github.com/commercetools/nimbus/commit/f3ad4b03a6ef8f6b148a00656498c7fb84d724c3)]:
  - @commercetools/nimbus-icons@1.0.1
  - @commercetools/nimbus-tokens@1.0.1
