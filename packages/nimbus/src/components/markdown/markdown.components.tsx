import React from "react";
import type { Components, ExtraProps } from "react-markdown";
import { OpenInNew } from "@commercetools/nimbus-icons";
import { Box } from "@/components/box/box";
import { VisuallyHidden } from "@/components/visually-hidden/visually-hidden";
import { MAX_HEADING_LEVEL } from "./markdown.constants";
import { getNodeText, isExternalUrl, withoutNode } from "./markdown.utils";
import {
  MarkdownHeadingSlot,
  MarkdownParagraphSlot,
  MarkdownLinkSlot,
  MarkdownInlineCodeSlot,
  MarkdownCodeBlockSlot,
  MarkdownListSlot,
  MarkdownListItemSlot,
  MarkdownBlockquoteSlot,
  MarkdownTableSlot,
  MarkdownTableHeaderCellSlot,
  MarkdownTableCellSlot,
  MarkdownImageSlot,
  MarkdownSeparatorSlot,
} from "./markdown.slots";

type HeadingRendererProps = React.ComponentPropsWithoutRef<"h1"> & ExtraProps;

/**
 * Build a heading renderer for a given source markdown level, applying
 * `headingOffset` so the rendered HTML heading is `min(level + offset, 6)`.
 * Both the semantic tag and the typography (via `data-level`) track the
 * rendered level.
 */
function makeHeadingRenderer(markdownLevel: number, headingOffset: number) {
  const level = Math.min(markdownLevel + headingOffset, MAX_HEADING_LEVEL);
  const tag = `h${level}` as React.ElementType;
  const Heading = (props: HeadingRendererProps) => (
    <MarkdownHeadingSlot as={tag} data-level={level} {...withoutNode(props)} />
  );
  Heading.displayName = `MarkdownHeading${markdownLevel}`;
  return Heading;
}

export type CreateNimbusComponentsOptions = {
  /** Heading-level offset applied to every heading renderer. */
  headingOffset: number;
  /** i18n "(opens in new tab)" label appended to external links. */
  opensInNewTabLabel: string;
};

/**
 * The default Nimbus renderer map. Every renderer strips the hast `node` before
 * spreading the remaining props onto the rendered element, so it never leaks
 * `node="[object Object]"` to the DOM.
 */
export function createNimbusComponents({
  headingOffset,
  opensInNewTabLabel,
}: CreateNimbusComponentsOptions): Components {
  return {
    h1: makeHeadingRenderer(1, headingOffset),
    h2: makeHeadingRenderer(2, headingOffset),
    h3: makeHeadingRenderer(3, headingOffset),
    h4: makeHeadingRenderer(4, headingOffset),
    h5: makeHeadingRenderer(5, headingOffset),
    h6: makeHeadingRenderer(6, headingOffset),

    p: (props) => <MarkdownParagraphSlot {...withoutNode(props)} />,

    a: ({ href, children, ...props }) => {
      const external = isExternalUrl(href);
      return (
        <MarkdownLinkSlot
          href={href}
          {...withoutNode(props)}
          {...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {children}
          {external && (
            <>
              <Box
                asChild
                boxSize="1em"
                display="inline-block"
                verticalAlign="text-bottom"
                marginInlineStart="50"
                aria-hidden="true"
              >
                <OpenInNew />
              </Box>
              <VisuallyHidden as="span"> {opensInNewTabLabel}</VisuallyHidden>
            </>
          )}
        </MarkdownLinkSlot>
      );
    },

    code: ({ className, children, ...props }) => {
      const isBlock =
        (typeof className === "string" && className.includes("language-")) ||
        String(children ?? "").includes("\n");
      if (isBlock) {
        return (
          <code className={className} {...withoutNode(props)}>
            {children}
          </code>
        );
      }
      return (
        <MarkdownInlineCodeSlot className={className} {...withoutNode(props)}>
          {children}
        </MarkdownInlineCodeSlot>
      );
    },

    pre: ({ children, ...props }) => (
      <MarkdownCodeBlockSlot {...withoutNode(props)}>
        {children}
      </MarkdownCodeBlockSlot>
    ),

    ul: (props) => <MarkdownListSlot as="ul" {...withoutNode(props)} />,
    ol: (props) => <MarkdownListSlot as="ol" {...withoutNode(props)} />,

    li: ({ node, className, children, ...props }) => {
      const isTask =
        typeof className === "string" && className.includes("task-list-item");
      if (isTask && node) {
        const label = getNodeText(
          node as unknown as Parameters<typeof getNodeText>[0]
        );
        const enhanced = React.Children.map(children, (child) =>
          React.isValidElement(child) && child.type === "input"
            ? React.cloneElement(
                child as React.ReactElement<
                  React.InputHTMLAttributes<HTMLInputElement>
                >,
                { "aria-label": label, readOnly: true }
              )
            : child
        );
        return (
          <MarkdownListItemSlot className={className} {...props}>
            {enhanced}
          </MarkdownListItemSlot>
        );
      }
      return (
        <MarkdownListItemSlot className={className} {...props}>
          {children}
        </MarkdownListItemSlot>
      );
    },

    blockquote: (props) => <MarkdownBlockquoteSlot {...withoutNode(props)} />,

    table: (props) => <MarkdownTableSlot {...withoutNode(props)} />,
    th: (props) => (
      <MarkdownTableHeaderCellSlot scope="col" {...withoutNode(props)} />
    ),
    td: (props) => <MarkdownTableCellSlot {...withoutNode(props)} />,

    img: ({ alt, src, ...props }) => {
      if (
        process.env.NODE_ENV !== "production" &&
        (alt === undefined || alt === "")
      ) {
        console.warn(
          `[Nimbus Markdown] An image is missing alt text${
            src ? ` (src: ${String(src)})` : ""
          }. Rendering it as decorative (alt=""). Provide alt text, or override the \`img\` renderer to handle untrusted images.`
        );
      }
      return (
        <MarkdownImageSlot
          src={src}
          {...withoutNode(props)}
          alt={alt ?? ""}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      );
    },

    hr: (props) => <MarkdownSeparatorSlot {...withoutNode(props)} />,
  };
}
