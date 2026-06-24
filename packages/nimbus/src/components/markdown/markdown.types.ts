import type { Components, Options } from "react-markdown";
import type { Options as SanitizeSchema } from "rehype-sanitize";
import type { BoxProps } from "@/components/box/box";

/**
 * Trust posture for the rendered source.
 *
 * - `"untrusted"` (default) — safe for AI / user-generated content: raw HTML is
 *   skipped and rendering is restricted to a safe element allowlist.
 * - `"trusted"` — for authored/internal content; may opt into raw HTML via
 *   `allowRawHtml`.
 */
export type MarkdownTrust = "untrusted" | "trusted";

/**
 * Map of HTML element names to the React components (or string tags) used to
 * render them. Re-export of `react-markdown`'s `Components` type — this is the
 * per-element override / custom-renderer surface.
 */
export type MarkdownComponents = Components;

/**
 * A list of remark/rehype plugins, as accepted by `react-markdown`. Derived
 * from `react-markdown`'s own option type so it stays in lockstep with the
 * engine version.
 */
export type MarkdownPluginList = NonNullable<Options["remarkPlugins"]>;

/**
 * Sanitization schema (from `rehype-sanitize` / `hast-util-sanitize`) used to
 * extend the allowlist when raw HTML is permitted under `trust="trusted"`.
 */
export type MarkdownSanitizeSchema = SanitizeSchema;

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
   * Trust posture for the source. Defaults to `"untrusted"` (safe for AI /
   * user-generated content).
   *
   * @default "untrusted"
   */
  trust?: MarkdownTrust;
  /**
   * When `trust="trusted"`, permits rendering raw HTML embedded in the source
   * by wiring `rehype-raw` paired with `rehype-sanitize` (sanitize applied
   * last). Ignored when `trust="untrusted"`.
   *
   * @default false
   */
  allowRawHtml?: boolean;
  /**
   * Optional `rehype-sanitize` schema used to extend the sanitization allowlist
   * when `allowRawHtml` is enabled (e.g. to let a custom-node tag survive).
   */
  sanitizeSchema?: MarkdownSanitizeSchema;
  /**
   * Per-element renderer overrides, shallow-merged per element key over the
   * Nimbus defaults. Overriding one element (e.g. `{ a: MyLink }`) leaves every
   * other default renderer intact. Each renderer also receives the original
   * hast `node`, enabling custom rendering of plugin-emitted nodes.
   */
  components?: MarkdownComponents;
  /**
   * Additional remark plugins, appended to the Nimbus defaults
   * (`[remark-gfm]`).
   */
  remarkPlugins?: MarkdownPluginList;
  /**
   * Additional rehype plugins, appended to the Nimbus defaults. Under
   * `trust="untrusted"` these cannot reintroduce live raw HTML — `skipHtml` and
   * the element allowlist filter the output regardless of plugin order.
   */
  rehypePlugins?: MarkdownPluginList;
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
