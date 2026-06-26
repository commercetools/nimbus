import type { Components, Options } from "react-markdown";

/**
 * Internal coordination type — NOT part of the public API.
 *
 * Deliberately defined in this non-barreled module (rather than
 * `markdown.types.ts`) so it is never re-exported from the package root. It is
 * exactly the resolved set of `react-markdown` props, shared between the
 * non-streaming render path (a single instance) and the streaming path (one
 * memoized instance per block): they are computed once in the main component
 * and passed down as stable references so memoized blocks compare equal. Every
 * field here is a valid `react-markdown` prop, so the whole object can be
 * spread onto `<ReactMarkdown>` directly.
 *
 * @internal
 */
export type ReactMarkdownRenderOptions = {
  components: Components;
  skipHtml: boolean;
  allowedElements?: Options["allowedElements"];
  disallowedElements?: Options["disallowedElements"];
  remarkPlugins: NonNullable<Options["remarkPlugins"]>;
  rehypePlugins: NonNullable<Options["rehypePlugins"]>;
};
