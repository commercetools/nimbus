declare module "remark-flexible-toc" {
  import type { Plugin } from "unified";

  // Loose option typing to match plugin's accepted shape without using any
  export type FlexibleTocItem = {
    value: string;
    depth: number;
    children?: FlexibleTocItem[];
  };

  export interface FlexibleTocOptions {
    tocRef?: FlexibleTocItem[];
    [key: string]: unknown;
  }

  const plugin: Plugin<[FlexibleTocOptions?] | [boolean]>;
  export default plugin;
}
