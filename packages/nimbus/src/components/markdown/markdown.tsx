import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import { useLocalizedStringFormatter } from "@/hooks";
import { Box } from "@/components/box/box";
import { VisuallyHidden } from "@/components/visually-hidden/visually-hidden";
import { createNimbusComponents, StreamingContent } from "./components";
import { DEFAULT_ALLOWED_ELEMENTS } from "./constants";
import { getHeadingLevels, findHeadingLevelSkips } from "./utils";
import { markdownMessagesStrings } from "./markdown.messages";
import type {
  MarkdownProps,
  ReactMarkdownRenderOptions,
} from "./markdown.types";

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
 * default renderers for every standard element, per-element overrides, custom
 * renderers for non-standard nodes, and safe incremental rendering of streamed
 * (LLM) output.
 *
 * Safe by default (`trust="untrusted"`): raw HTML is skipped and rendering is
 * restricted to a safe element allowlist; image-host security is delegated to
 * the application Content-Security-Policy.
 *
 * @supportsStyleProps
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/content/markdown}
 */
export const Markdown = (props: MarkdownProps) => {
  const {
    children,
    trust = "untrusted",
    allowRawHtml = false,
    sanitizeSchema,
    components: componentsOverride,
    remarkPlugins: extraRemarkPlugins,
    rehypePlugins: extraRehypePlugins,
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
  const everStreamed = React.useRef(false);
  if (isStreaming) everStreamed.current = true;
  const [announcement, setAnnouncement] = React.useState("");
  const wasStreaming = React.useRef(isStreaming);
  React.useEffect(() => {
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
    return { ...nimbusComponents, ...componentsOverride };
  }, [headingOffset, opensInNewTabLabel, componentsOverride]);

  // Raw HTML is only ever live for trusted content that explicitly opts in.
  const rawHtmlEnabled = trust === "trusted" && allowRawHtml;

  const remarkPlugins = React.useMemo(
    () => [remarkGfm, ...(extraRemarkPlugins ?? [])],
    [extraRemarkPlugins]
  );

  const rehypePlugins = React.useMemo(() => {
    const base: NonNullable<ReactMarkdownRenderOptions["rehypePlugins"]> = [];
    if (rawHtmlEnabled) {
      // rehype-raw reconstructs raw HTML; rehype-sanitize MUST run after it.
      base.push(rehypeRaw);
      base.push([rehypeSanitize, sanitizeSchema ?? defaultSchema]);
    }
    return [...base, ...(extraRehypePlugins ?? [])];
  }, [rawHtmlEnabled, sanitizeSchema, extraRehypePlugins]);

  // Resolve the element allowlist. react-markdown forbids passing both
  // allowedElements and disallowedElements, so honor a consumer's explicit
  // choice first; otherwise apply the safe default allowlist (unless raw HTML
  // is enabled, where rehype-sanitize is the gate).
  const resolvedAllowedElements = React.useMemo(() => {
    if (allowedElements) return allowedElements;
    if (disallowedElements) return undefined;
    if (rawHtmlEnabled) return undefined;
    return DEFAULT_ALLOWED_ELEMENTS as string[];
  }, [allowedElements, disallowedElements, rawHtmlEnabled]);

  const renderOptions = React.useMemo<ReactMarkdownRenderOptions>(
    () => ({
      components,
      skipHtml: !rawHtmlEnabled,
      allowedElements: resolvedAllowedElements,
      disallowedElements: allowedElements ? undefined : disallowedElements,
      remarkPlugins,
      rehypePlugins,
    }),
    [
      components,
      rawHtmlEnabled,
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
        <StreamingContent source={children} {...renderOptions} />
      ) : (
        <ReactMarkdown {...renderOptions}>{children}</ReactMarkdown>
      )}
      {everStreamed.current && (
        <VisuallyHidden as="div" role="status" aria-live="polite">
          {announcement}
        </VisuallyHidden>
      )}
    </Box>
  );
};

Markdown.displayName = "Markdown";
