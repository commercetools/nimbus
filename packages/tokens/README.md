# Design System Tokens Package

This package is the single source of truth for our design tokens.

## Defining Tokens

All tokens are defined in `src/tokens/base.json`. All changes to the design
tokens should occur in this file.

### Token Format

Tokens in `src/tokens/base.json` are defined using a modified version of the
[W3C Design Tokens Community Group](https://www.w3.org/groups/cg/design-tokens/)
Token Definition [Standard](https://tr.designtokens.org/format/).

The version we use is somewhat modified to be more compatible with the
[Tokens Studio for Figma](https://docs.tokens.studio/) plugin. We specifically
use a subset of
[unofficial](https://docs.tokens.studio/token-types/token-type-overview#terms-to-be-aware-of)
tokens-studio-specific types. This enables for better token definitions in
figma.

When adding tokens, define them using the DTCG spec, then upload them into the
Tokens Studio plugin in Figma to make sure that they are defined as expeced in
the figma file.

This process will be documented better as we start contributing changes to
tokens.

## Building Tokens

Once tokens have been added to `src/tokens/base.json` in the correct format and
successfully updated in Figma, it is necessary to update them for all supported
platforms: Typescript, CSS, and Chakra-specific (internal).

To update all platforms, run the following script from this directory:

```bash
pnpm build
```

This will update all tokens in `src/generated`.

### Token Build Process

Tokens are transformed from the tokens stored in `src/tokens/base.json` using
[style-dictionary](https://styledictionary.com/getting-started/installation/).

Style dictionary is configured in `src/style-dictionary.config.js`. Update this
config file in order to change the formatting of any tokens in
`src/generated/*`. See comments in that file for more information.

This process will also be better documented as we start distributing the tokens
package for use in the design system.
