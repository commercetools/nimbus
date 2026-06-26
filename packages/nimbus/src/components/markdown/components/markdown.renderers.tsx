import React from "react";
import type { Components, ExtraProps } from "react-markdown";
import { chakra } from "@chakra-ui/react/styled-system";
import { OpenInNew } from "@commercetools/nimbus-icons";
import { Box } from "@/components/box/box";
import { Heading } from "@/components/heading/heading";
import { Text } from "@/components/text/text";
import { Code } from "@/components/code/code";
import { Link } from "@/components/link/link";
import { VisuallyHidden } from "@/components/visually-hidden/visually-hidden";
import { MAX_HEADING_LEVEL } from "../constants";
import { getNodeText, isExternalUrl, withoutNode } from "../utils";

type HeadingRendererProps = React.ComponentPropsWithoutRef<"h1"> & ExtraProps;

/**
 * Per-(rendered)-level typography reproducing the Figma `Markdown/*` heading
 * scale, applied as style props over the Nimbus `Heading` component.
 */
const HEADING_STYLES: Record<number, { fontSize: string; lineHeight: string }> =
  {
    1: { fontSize: "600", lineHeight: "700" }, // H1 24/28
    2: { fontSize: "500", lineHeight: "600" }, // H2 20/24
    3: { fontSize: "450", lineHeight: "600" }, // H3 18/24
    4: { fontSize: "400", lineHeight: "500" }, // H4 16/20
    5: { fontSize: "400", lineHeight: "500" }, // h5 folds to H4
    6: { fontSize: "400", lineHeight: "500" }, // h6 folds to H4
  };

/**
 * Build a heading renderer for a given source markdown level, applying
 * `headingOffset` so the rendered HTML heading is `min(level + offset, 6)`.
 * Both the semantic tag (via `as`) and the typography track the rendered level.
 */
function makeHeadingRenderer(markdownLevel: number, headingOffset: number) {
  const level = Math.min(markdownLevel + headingOffset, MAX_HEADING_LEVEL);
  const tag = `h${level}` as React.ElementType;
  const Heading_ = (props: HeadingRendererProps) => (
    <Heading
      as={tag}
      data-level={level}
      fontFamily="heading"
      fontWeight="600"
      color="neutral.12"
      {...HEADING_STYLES[level]}
      {...withoutNode(props)}
    />
  );
  Heading_.displayName = `MarkdownHeading${markdownLevel}`;
  return Heading_;
}

export type CreateNimbusComponentsOptions = {
  /** Heading-level offset applied to every heading renderer. */
  headingOffset: number;
  /** i18n "(opens in new tab)" label appended to external links. */
  opensInNewTabLabel: string;
};

/**
 * The default Nimbus renderer map. Standard elements render through Nimbus
 * components (`Heading`, `Text`, `Code`, `Link`) so they inherit the design
 * system automatically; elements without a Nimbus component (code blocks,
 * blockquotes, lists, tables, images, rules) render as styled `chakra.*`
 * primitives with style props. Every renderer strips the hast `node` before
 * spreading the remaining props onto the element, so it never leaks
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

    p: (props) => <Text as="p" {...withoutNode(props)} />,

    a: ({ href, children, ...props }) => {
      const external = isExternalUrl(href);
      return (
        <Link
          href={href}
          {...(withoutNode(props) as React.ComponentProps<typeof Link>)}
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
        </Link>
      );
    },

    code: ({ className, children, ...props }) => {
      const isBlock =
        (typeof className === "string" && className.includes("language-")) ||
        String(children ?? "").includes("\n");
      if (isBlock) {
        // Block code is styled by the enclosing `pre`; render a bare element.
        return (
          <code className={className} {...withoutNode(props)}>
            {children}
          </code>
        );
      }
      return (
        <Code className={className} {...withoutNode(props)}>
          {children}
        </Code>
      );
    },

    pre: (props) => (
      <chakra.pre
        fontFamily="mono"
        fontSize="350"
        lineHeight="550"
        bg="neutral.3"
        color="neutral.12"
        borderRadius="200"
        p="300"
        overflowX="auto"
        whiteSpace="pre"
        css={{ "& code": { fontFamily: "mono", bg: "transparent", p: "0" } }}
        {...withoutNode(props)}
      />
    ),

    ul: (props) => (
      <chakra.ul
        paddingInlineStart="600"
        css={{
          "& > li + li": { marginTop: "200" },
          "& :where(ul, ol)": { marginTop: "200" },
        }}
        {...withoutNode(props)}
      />
    ),
    ol: (props) => (
      <chakra.ol
        paddingInlineStart="600"
        css={{
          "& > li + li": { marginTop: "200" },
          "& :where(ul, ol)": { marginTop: "200" },
        }}
        {...withoutNode(props)}
      />
    ),

    li: ({ node, className, children, ...props }) => {
      const checkboxCss = {
        "& > input[type='checkbox']": {
          marginInlineEnd: "200",
          verticalAlign: "middle",
        },
      };
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
          <chakra.li className={className} css={checkboxCss} {...props}>
            {enhanced}
          </chakra.li>
        );
      }
      return (
        <chakra.li className={className} css={checkboxCss} {...props}>
          {children}
        </chakra.li>
      );
    },

    blockquote: (props) => (
      <chakra.blockquote
        borderInlineStartWidth="2px"
        borderInlineStartStyle="solid"
        borderColor="neutral.6"
        paddingInlineStart="400"
        color="neutral.11"
        fontStyle="italic"
        {...withoutNode(props)}
      />
    ),

    table: (props) => (
      <chakra.table
        width="100%"
        borderCollapse="collapse"
        fontSize="350"
        lineHeight="500"
        css={{
          "& :where(th, td)": {
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "neutral.6",
            paddingInline: "300",
            paddingBlock: "200",
            textAlign: "start",
          },
        }}
        {...withoutNode(props)}
      />
    ),
    th: (props) => (
      <chakra.th
        scope="col"
        fontWeight="700"
        bg="neutral.2"
        {...withoutNode(props)}
      />
    ),
    td: (props) => <chakra.td {...withoutNode(props)} />,

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
        <chakra.img
          src={src}
          {...withoutNode(props)}
          alt={alt ?? ""}
          loading="lazy"
          referrerPolicy="no-referrer"
          maxWidth="100%"
          height="auto"
          borderRadius="200"
        />
      );
    },

    hr: (props) => (
      <chakra.hr borderColor="neutral.6" {...withoutNode(props)} />
    ),

    // GFM footnote reference marker (wraps the `[^n]` link).
    sup: (props) => (
      <chakra.sup fontSize="0.75em" lineHeight="0" {...withoutNode(props)} />
    ),

    // GFM footnotes definitions block. `<section>` is only emitted for
    // footnotes, so this styles that block: a top divider plus muted, smaller
    // text. The auto-generated "Footnotes" label (an `h2#footnote-label`) is
    // visually hidden — its default `sr-only` class is a no-op in Nimbus — so it
    // stays available to assistive tech without rendering a redundant heading.
    // The gap above the divider comes from the root's inter-block rhythm.
    section: (props) => (
      <chakra.section
        paddingTop="400"
        borderTopWidth="1px"
        borderTopStyle="solid"
        borderTopColor="neutral.6"
        fontSize="350"
        lineHeight="500"
        color="neutral.11"
        css={{
          "& [id='footnote-label']": {
            position: "absolute",
            width: "1px",
            height: "1px",
            padding: "0",
            margin: "-1px",
            overflow: "hidden",
            clip: "rect(0, 0, 0, 0)",
            whiteSpace: "nowrap",
            borderWidth: "0",
          },
        }}
        {...withoutNode(props)}
      />
    ),
  };
}
