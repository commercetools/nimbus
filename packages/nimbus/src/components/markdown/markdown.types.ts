import type { Components, ExtraProps, Options } from "react-markdown";
import type { ComponentType } from "react";
import type { BoxProps } from "@/components/box/box";

/**
 * Renderer for a custom component tag embedded in the source (e.g.
 * `<SearchQueryResultCard id="foo" />`). Receives the tag's parsed string
 * attributes as props, plus `react-markdown`'s `node` / {@link ExtraProps}.
 */
export type MarkdownCustomComponent = ComponentType<
  Record<string, string | boolean | undefined> & ExtraProps
>;

/**
 * Map of tag names to the React components (or string tags) used to render
 * them.
 *
 * Standard HTML/GFM element keys (e.g. `a`, `h1`, `code`) are per-element
 * overrides typed precisely by `react-markdown`'s `Components`. Any *additional*
 * key (conventionally PascalCase, e.g. `SearchQueryResultCard`) registers a
 * **custom component tag**: the matching tag is parsed out of the source and
 * rendered by the supplied component, with its string attributes passed as
 * props.
 *
 * Note: the open index signature means a typo in a standard element key is no
 * longer flagged as an excess property — the accepted tradeoff for an open
 * renderer map.
 */
export type MarkdownComponents = Components & {
  [tagName: string]: Components[keyof Components] | MarkdownCustomComponent;
};

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
  /**
   * Registered custom-component tag names. Internal-only — consumed by the
   * streaming block splitter so a paired `<Name>…</Name>` region stays in one
   * block; never forwarded to `react-markdown`.
   */
  customTagNames?: ReadonlySet<string>;
};

/**
 * Props for the {@link Markdown} component.
 *
 * Style props are forwarded to the component's outer root container (the
 * standard Nimbus pattern), so consumers control width/measure, clamping and
 * spacing with the usual style props rather than bespoke layout props.
 */
export type MarkdownProps = Omit<BoxProps, "children"> & {
  /**
   * The Markdown source string to render (canonical input, matching
   * `react-markdown`). GitHub Flavored Markdown — tables, task lists,
   * strikethrough, autolinks — is enabled by default.
   */
  children: string;
  /**
   * Renderer map, shallow-merged per key over the Nimbus defaults. Two uses:
   *
   * - **Per-element override** — a standard element key (e.g. `{ a: MyLink }`)
   *   replaces that one default renderer; all others stay intact.
   * - **Custom component tag** — a non-standard key (e.g.
   *   `{ SearchQueryResultCard: Card }`) registers a tag that can be embedded in
   *   the source (`<SearchQueryResultCard id="foo" />`); its string attributes
   *   are passed to the component as props. Tag names match by exact case, so
   *   any casing is preserved. Safe by default: a custom tag renders only if a
   *   component is registered for it — unregistered tags stay inert.
   */
  components?: MarkdownComponents;
  /**
   * Restrict rendering to this set of element names. Defaults to a safe
   * allowlist covering all Nimbus default renderers. Mutually exclusive with
   * `disallowedElements`.
   */
  allowedElements?: Options["allowedElements"];
  /**
   * Remove these element names from the rendered output. Mutually exclusive
   * with `allowedElements`.
   */
  disallowedElements?: Options["disallowedElements"];
  /**
   * Enables safe incremental rendering of streamed (e.g. LLM) output:
   * unterminated inline constructs are completed via `remend`, content is split
   * into memoized blocks so only the final block re-parses per token, and the
   * root manages `aria-busy` plus a single coalesced completion announcement.
   *
   * @default false
   */
  isStreaming?: boolean;
  /**
   * Shifts rendered heading levels to preserve the host page outline: a
   * markdown heading of level `L` renders as `min(L + headingOffset, 6)`.
   *
   * @default 0
   */
  headingOffset?: number;
  /**
   * Ref to the outer root container element.
   */
  ref?: React.Ref<HTMLDivElement>;
};
