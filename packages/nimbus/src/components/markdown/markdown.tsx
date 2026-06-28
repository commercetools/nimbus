import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { useLocalizedStringFormatter } from "@/hooks";
import { Box } from "@/components/box/box";
import { VisuallyHidden } from "@/components/visually-hidden/visually-hidden";
import { createNimbusComponents, StreamingContent } from "./components";
import { DEFAULT_ALLOWED_ELEMENTS } from "./constants";
import {
  remarkCustomComponentTags,
  remarkGithubAlerts,
  ALERT_TYPES,
} from "./utils";
import { useHeadingSkipWarning } from "./hooks/use-heading-skip-warning";
import { markdownMessagesStrings } from "./markdown.messages";
import type { MarkdownProps } from "./markdown.types";
import type { ReactMarkdownRenderOptions } from "./markdown.internal-types";

/**
 * # Markdown
 *
 * Renders a Markdown string into Nimbus-styled, accessible React elements with
 * default renderers for every standard element, per-element overrides, embedded
 * custom component tags, and safe incremental rendering of streamed (LLM)
 * output.
 *
 * Safe by default: raw HTML is never rendered and rendering is restricted to a
 * safe element allowlist; image-host security is delegated to the application
 * Content-Security-Policy.
 *
 * @supportsStyleProps
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/content/markdown}
 */
export const Markdown = (props: MarkdownProps) => {
  const {
    children,
    components: componentsOverride,
    allowedElements,
    disallowedElements,
    isStreaming = false,
    headingOffset = 0,
    ref,
    ...styleProps
  } = props;

  const stringFormatter = useLocalizedStringFormatter(markdownMessagesStrings);
  const opensInNewTabLabel = stringFormatter.format("opensInNewTab");
  const completeLabel = stringFormatter.format("streamingComplete");

  // Localized GFM footnote strings, forwarded to remark-rehype. Memoized on the
  // (per-locale stable) formatter so the object identity holds across renders
  // and streamed footnote blocks don't remount.
  const remarkRehypeOptions = React.useMemo<
    ReactMarkdownRenderOptions["remarkRehypeOptions"]
  >(
    () => ({
      footnoteLabel: stringFormatter.format("footnoteLabel"),
      footnoteBackLabel: (referenceIndex: number) =>
        stringFormatter.format("footnoteBackLabel", {
          index: referenceIndex + 1,
        }),
    }),
    [stringFormatter]
  );

  // Localized, visually-hidden type labels for GitHub alerts (note/tip/…), keyed
  // by alert type. Memoized on the (per-locale stable) formatter so the renderer
  // map memo stays stable.
  const alertLabels = React.useMemo(
    () =>
      Object.fromEntries(
        ALERT_TYPES.map((type) => [
          type,
          stringFormatter.format(
            `alert${type[0].toUpperCase()}${type.slice(1)}`
          ),
        ])
      ) as Record<(typeof ALERT_TYPES)[number], string>,
    [stringFormatter]
  );

  useHeadingSkipWarning(children);

  // Accessible streaming state, owned by the always-mounted root so it survives
  // the moment `isStreaming` flips to false. The live region is mounted (empty)
  // for the duration of streaming, then receives a single coalesced completion
  // announcement on settle — so screen readers announce it reliably.
  //
  // `everStreamed` is state (not a ref) and is latched from an effect rather
  // than during render: this both keeps render pure (no ref mutation that a
  // discarded concurrent render could leave dangling) and guarantees the empty
  // live region mounts in its own commit *before* any announcement text is
  // injected — assistive tech only reliably announces a content change in a
  // pre-existing live region. `setEverStreamed(true)` is a no-op once latched.
  //
  // The announcement is re-emptied each time streaming (re)starts so a reused
  // instance (e.g. a chat "regenerate" that streams a second response into the
  // same node) keeps the live region empty while busy and produces a real
  // text change (`"" → completeLabel`) on the next settle — otherwise setting
  // the identical string is a no-op and the second completion never announces.
  const [everStreamed, setEverStreamed] = React.useState(false);
  const [announcement, setAnnouncement] = React.useState("");
  const wasStreaming = React.useRef(isStreaming);
  React.useEffect(() => {
    if (isStreaming) {
      setEverStreamed(true);
      setAnnouncement("");
    }
    if (wasStreaming.current && !isStreaming) {
      setAnnouncement(completeLabel);
    }
    wasStreaming.current = isStreaming;
  }, [isStreaming, completeLabel]);

  // Default renderer map, merged with consumer overrides (shallow per key).
  // The cast to `Components` is required and safe: `MarkdownComponents` has an
  // open index signature so a custom-tag renderer (a `MarkdownCustomComponent`,
  // keyed by its PascalCase tag name) is not structurally assignable to
  // react-markdown's closed `Components` type — yet keying custom renderers by
  // tag name is exactly how react-markdown resolves them at runtime (the remark
  // plugin emits a matching `hName`). See `MarkdownComponents` in
  // markdown.types.ts for the open-renderer-map tradeoff.
  const components = React.useMemo(() => {
    const nimbusComponents = createNimbusComponents({
      headingOffset,
      opensInNewTabLabel,
      alertLabels,
    });
    return { ...nimbusComponents, ...componentsOverride } as Components;
  }, [headingOffset, opensInNewTabLabel, alertLabels, componentsOverride]);

  // Custom component tags = consumer `components` keys that are not standard
  // markdown/GFM element names. Their presence (a) registers them with the
  // custom-tag remark plugin so the matching tags are materialized, and (b) is
  // unioned into the element allowlist so react-markdown does not strip them.
  const customTagNames = React.useMemo(() => {
    const standard = new Set(DEFAULT_ALLOWED_ELEMENTS);
    return new Set(
      Object.keys(componentsOverride ?? {}).filter(
        (name) => !standard.has(name)
      )
    );
  }, [componentsOverride]);

  const remarkPlugins = React.useMemo<
    NonNullable<ReactMarkdownRenderOptions["remarkPlugins"]>
  >(
    () =>
      customTagNames.size > 0
        ? [
            remarkGfm,
            remarkGithubAlerts,
            remarkCustomComponentTags({ registeredNames: customTagNames }),
          ]
        : [remarkGfm, remarkGithubAlerts],
    [customTagNames]
  );

  // Raw HTML is never rendered: Markdown is safe by default. Custom components
  // are materialized by the Nimbus-owned remark plugin above, not rehype-raw.
  const rehypePlugins = React.useMemo<
    NonNullable<ReactMarkdownRenderOptions["rehypePlugins"]>
  >(() => [], []);

  // react-markdown throws when both allowedElements and disallowedElements are
  // passed; we normalize to allowedElements instead (below) so the component
  // never crashes, but warn in development so the silently-ignored
  // disallowedElements does not go unnoticed.
  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (allowedElements && disallowedElements) {
      console.warn(
        "[Nimbus Markdown] `allowedElements` and `disallowedElements` are " +
          "mutually exclusive. `allowedElements` takes precedence; " +
          "`disallowedElements` is ignored."
      );
    }
  }, [allowedElements, disallowedElements]);

  // Resolve the element allowlist. react-markdown forbids passing both
  // allowedElements and disallowedElements, so honor a consumer's explicit
  // choice first; otherwise apply the safe default allowlist. Registered custom
  // tag names are unioned in so they survive the allowlist filter.
  const resolvedAllowedElements = React.useMemo(() => {
    if (allowedElements) return [...allowedElements, ...customTagNames];
    if (disallowedElements) return undefined;
    return [...DEFAULT_ALLOWED_ELEMENTS, ...customTagNames];
  }, [allowedElements, disallowedElements, customTagNames]);

  // Exactly the react-markdown props, so the whole object spreads onto
  // <ReactMarkdown> (and each streaming MemoBlock) directly. The internal-only
  // `customTagNames` is kept out and passed separately to the streaming path.
  const renderOptions = React.useMemo<ReactMarkdownRenderOptions>(
    () => ({
      components,
      skipHtml: true,
      allowedElements: resolvedAllowedElements,
      disallowedElements: allowedElements ? undefined : disallowedElements,
      remarkPlugins,
      rehypePlugins,
      remarkRehypeOptions,
    }),
    [
      components,
      resolvedAllowedElements,
      allowedElements,
      disallowedElements,
      remarkPlugins,
      rehypePlugins,
      remarkRehypeOptions,
    ]
  );

  return (
    <Box
      ref={ref}
      className="nimbus-markdown"
      // Establish a containing block for the absolutely-positioned
      // VisuallyHidden live region (below). Without it, that 1×1px element
      // anchors to the nearest positioned ancestor (often the viewport) at the
      // full, unclipped content height — so in a scroll container (the typical
      // streaming chat layout) it escapes the overflow clip and stretches the
      // page/document scrollbar as the transcript grows.
      position="relative"
      // Own the whitespace mode rather than inheriting it. react-markdown emits
      // literal "\n" text nodes between block elements (e.g. between <li>s);
      // under an ancestor `white-space: pre`/`pre-wrap` those render as real
      // blank lines and inflate the spacing between blocks. `normal` collapses
      // them as intended. Code blocks are unaffected — the <pre> renderer sets
      // its own `white-space: pre`.
      whiteSpace="normal"
      color="neutral.12"
      fontFamily="body"
      fontSize="400"
      lineHeight="600"
      fontWeight="400"
      aria-busy={isStreaming || undefined}
      {...styleProps}
    >
      {/* Inner content wrapper: a plain, full-width block box. It keeps the
          rendered markdown in normal block flow even if a consumer turns the
          root into a flex/grid container via a style prop (e.g.
          `display="flex"`) — the content stays one full-width child rather than
          collapsing to its intrinsic width or laying its blocks out in a row.
          The vertical rhythm lives here because these blocks are its direct
          children. */}
      <Box
        width="100%"
        css={{
          // Vertical rhythm between top-level blocks; tighter above content that
          // follows a heading.
          "& > * + *": { marginTop: "400" },
          "& > :where(h1, h2, h3, h4, h5, h6) + *": { marginTop: "300" },
        }}
      >
        {isStreaming ? (
          <StreamingContent
            source={children}
            customTagNames={customTagNames}
            {...renderOptions}
          />
        ) : (
          <ReactMarkdown {...renderOptions}>{children}</ReactMarkdown>
        )}
      </Box>
      {everStreamed && (
        <VisuallyHidden as="div" role="status">
          {announcement}
        </VisuallyHidden>
      )}
    </Box>
  );
};

Markdown.displayName = "Markdown";
