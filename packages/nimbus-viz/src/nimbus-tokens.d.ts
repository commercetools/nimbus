// Ambient typing for @commercetools/nimbus-tokens.
//
// The package's ESM export condition ships no `types`, so under bundler module
// resolution TypeScript can't find declarations for the values we import. We
// declare the subset the theme layer reads. (Prototype-stage: replace with the
// package's own types if/when it ships ESM declarations.)
declare module "@commercetools/nimbus-tokens" {
  type ColorScale = Record<string, string>;
  interface SystemPalette {
    light: ColorScale;
    dark: ColorScale;
  }
  export const designTokens: {
    color: {
      "system-palettes": Record<string, SystemPalette>;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  export const themeTokens: unknown;
}
