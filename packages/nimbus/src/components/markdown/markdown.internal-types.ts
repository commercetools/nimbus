import type { Components, Options } from "react-markdown";

/**
 * Internal coordination type — NOT part of the public API.
 *
 * Deliberately defined in this non-barreled module (rather than
 * `markdown.types.ts`) so it is never re-exported from the package root. It
 * exists only to share resolved `react-markdown` options between the
 * non-streaming render path (a single instance) and the streaming path (one
 * memoized instance per block): they are computed once in the main component
 * and passed down as stable references so memoized blocks compare equal.
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
  /**
   * Registered custom-component tag names. Internal-only — consumed by the
   * streaming block splitter so a paired `<Name>…</Name>` region stays in one
   * block; never forwarded to `react-markdown`.
   */
  customTagNames?: ReadonlySet<string>;
};
