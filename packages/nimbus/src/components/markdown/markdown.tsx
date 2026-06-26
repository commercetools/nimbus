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
  getHeadingLevels,
  findHeadingLevelSkips,
  remarkCustomComponentTags,
} from "./utils";
import { markdownMessagesStrings } from "./markdown.messages";
import type { MarkdownProps } from "./markdown.types";
import type { ReactMarkdownRenderOptions } from "./markdown.internal-types";

/**
 * Emit a development-mode warning when author markdown skips a heading level
 * (e.g. `#` then `###`). The content is still rendered faithfully — Nimbus does
 * not silently rewrite author structure.
 */
function useHeadingSkipWarning(source: string) {
  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const skips = findHeadingLevelSkips(getHeadingLevels(source));
    for (const { from, to } of skips) {
      console.warn(
        `[Nimbus Markdown] Heading level skip detected (h${from} → h${to}). ` +
          `Skipping levels can break the document outline for assistive technology. ` +
          `Consider adjusting the source or using \`headingOffset\`.`
      );
    }
  }, [source]);
}

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
  const [everStreamed, setEverStreamed] = React.useState(false);
  const [announcement, setAnnouncement] = React.useState("");
  const wasStreaming = React.useRef(isStreaming);
  React.useEffect(() => {
    if (isStreaming) setEverStreamed(true);
    if (wasStreaming.current && !isStreaming) {
      setAnnouncement(completeLabel);
    }
    wasStreaming.current = isStreaming;
  }, [isStreaming, completeLabel]);

  // Default renderer map, merged with consumer overrides (shallow per key).
  const components = React.useMemo(() => {
    const nimbusComponents = createNimbusComponents({
      headingOffset,
      opensInNewTabLabel,
    });
    return { ...nimbusComponents, ...componentsOverride } as Components;
  }, [headingOffset, opensInNewTabLabel, componentsOverride]);

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
            remarkCustomComponentTags({ registeredNames: customTagNames }),
          ]
        : [remarkGfm],
    [customTagNames]
  );

  // Raw HTML is never rendered: Markdown is safe by default. Custom components
  // are materialized by the Nimbus-owned remark plugin above, not rehype-raw.
  const rehypePlugins = React.useMemo<
    NonNullable<ReactMarkdownRenderOptions["rehypePlugins"]>
  >(() => [], []);

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
    }),
    [
      components,
      resolvedAllowedElements,
      allowedElements,
      disallowedElements,
      remarkPlugins,
      rehypePlugins,
    ]
  );

  return (
    <Box
      ref={ref}
      className="nimbus-markdown"
      color="neutral.12"
      fontFamily="body"
      fontSize="400"
      lineHeight="600"
      fontWeight="400"
      aria-busy={isStreaming || undefined}
      css={{
        // Vertical rhythm between top-level blocks; tighter above content that
        // follows a heading.
        "& > * + *": { marginTop: "400" },
        "& > :where(h1, h2, h3, h4, h5, h6) + *": { marginTop: "300" },
      }}
      {...styleProps}
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
      {everStreamed && (
        <VisuallyHidden as="div" role="status" aria-live="polite">
          {announcement}
        </VisuallyHidden>
      )}
    </Box>
  );
};

Markdown.displayName = "Markdown";
