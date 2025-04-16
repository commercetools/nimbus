import { Heading } from "@commercetools/nimbus";
import { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";
import GithubSlugger from "github-slugger";

const slugger = new GithubSlugger();

/**
 * Generates a slug from React children.
 *
 * This function ensures that the slug generated is consistent with the one produced by the toc-plugin.
 * It converts the children to a string, generates a slug, and then removes any "-1" suffixes that might
 * be added by the slugger.
 *
 * @param {ReactNode} children - The React children to convert to a slug
 * @returns {string} The generated slug
 */
const sluggifyChildren = (children: ReactNode) => {
  return slugger
    .slug(children ? children.toString() : "")
    .split("-1")
    .join("");
};

type HeadingProps = DetailedHTMLProps<
  HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>;

const commonProps = (props: HeadingProps) => ({
  /**
   * adds the id to the heading
   * this is needed for linking directly to this part of the document
   */
  id: sluggifyChildren(props.children),
  /**
   * makes sure that the heading is not covered by the sticky navbar
   * magic-number: roughly the header-height + some extra-padding
   */
  scrollMarginTop: "2400",
});

export const H1 = (props: HeadingProps) => (
  <Heading {...commonProps(props)} mb="600" size="3xl" asChild>
    <h1 {...props} />
  </Heading>
);

export const H2 = (props: HeadingProps) => (
  <Heading {...commonProps(props)} mb="300" mt="600" size="2xl" asChild>
    <h2 {...props} />
  </Heading>
);

export const H3 = (props: HeadingProps) => (
  <Heading {...commonProps(props)} mb="300" mt="600" size="xl" asChild>
    <h3 {...props} />
  </Heading>
);
export const H4 = (props: HeadingProps) => (
  <Heading {...commonProps(props)} mb="300" mt="600" size="lg" asChild>
    <h4 {...props} />
  </Heading>
);
export const H5 = (props: HeadingProps) => (
  <Heading
    {...commonProps(props)}
    mb="300"
    mt="600"
    size="lg"
    fontWeight="500"
    asChild
  >
    <h5 {...props} />
  </Heading>
);
export const H6 = (props: HeadingProps) => (
  <Heading
    {...commonProps(props)}
    mb="300"
    mt="600"
    size="lg"
    fontWeight="400"
    asChild
  >
    <h6 {...props} />
  </Heading>
);
