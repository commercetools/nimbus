# @commercetools/nimbus-design-token-ts-plugin

TypeScript language service plugin that shows design token CSS values in
autocomplete when editing Chakra UI styled-system properties.

When you type `gap="` in a component, the autocomplete dropdown shows entries
like:

```
600  = 24px
400  = 16px
200  = 8px
```

instead of just the raw token names.

## Supported Token Categories

- **Spacing** (including negatives): `gap`, `padding`, `margin`, etc.
- **Font sizes**: `fontSize`
- **Border radius**: `borderRadius`
- **Colors**: `color`, `bg`, `borderColor`, etc.
- **Blur**: `blur`
- **Shadows**: `shadow`, `boxShadow`
- **Font weights**: `fontWeight`
- **Line heights**: `lineHeight`
- **Sizes**: `width`, `height`, `minWidth`, etc.
- **Opacity**: `opacity`
- **Z-index**: `zIndex`
- **Durations**: `transitionDuration`, `animationDuration`
- And more

## Installation

```bash
pnpm add -D @commercetools/nimbus-design-token-ts-plugin
```

## Configuration

Add the plugin to your `tsconfig.json` (or `tsconfig.app.json` if using project
references):

```json
{
  "compilerOptions": {
    "plugins": [{ "name": "@commercetools/nimbus-design-token-ts-plugin" }]
  }
}
```

## VS Code Setup

1. Open the command palette (Cmd+Shift+P / Ctrl+Shift+P)
2. Run **"TypeScript: Select TypeScript Version"**
3. Select **"Use Workspace Version"**
4. Restart the TS server: **"TypeScript: Restart TS Server"**

The plugin only works with the workspace TypeScript version, not VS Code's
built-in version.

## How It Works

The plugin intercepts TypeScript's `getCompletionsAtPosition` calls. When it
detects that the completion entries match a known design token category (by
fingerprinting the set of available values), it annotates each entry with the
resolved CSS value from `@commercetools/nimbus-tokens`.

The detection is automatic - no configuration of which properties map to which
token categories is needed. The plugin infers the category from the completions
TypeScript already provides.

## Requirements

- `@commercetools/nimbus-tokens` must be installed (included as a dependency)
- TypeScript >= 5.0
- VS Code or any editor that supports TypeScript language service plugins
