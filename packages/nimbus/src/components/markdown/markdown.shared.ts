import type { Components, Options } from "react-markdown";

/**
 * The resolved set of `react-markdown` options shared between the non-streaming
 * render path (a single instance) and the streaming path (one memoized instance
 * per block). These are computed once in the main component and passed down as
 * stable references so memoized blocks compare equal.
 */
export type ReactMarkdownRenderOptions = {
  components: Components;
  skipHtml: boolean;
  allowedElements?: Options["allowedElements"];
  disallowedElements?: Options["disallowedElements"];
  remarkPlugins: NonNullable<Options["remarkPlugins"]>;
  rehypePlugins: NonNullable<Options["rehypePlugins"]>;
};
