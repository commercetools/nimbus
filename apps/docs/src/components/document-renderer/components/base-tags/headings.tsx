import { sluggify } from "@/utils/sluggify";
import { Heading } from "@bleh-ui/react";
import { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";

const sluggifyChildren = (children: ReactNode) => {
  return sluggify(children ? children.toString() : "");
};

type HeadingProps = DetailedHTMLProps<
  HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>;

export const H1 = (props: HeadingProps) => (
  <Heading id={sluggifyChildren(props.children)} mb="6" size="3xl" asChild>
    <h1 {...props} />
  </Heading>
);

export const H2 = (props: HeadingProps) => (
  <Heading
    id={sluggifyChildren(props.children)}
    mb="3"
    mt="6"
    size="2xl"
    asChild
  >
    <h2 {...props} />
  </Heading>
);

export const H3 = (props: HeadingProps) => (
  <Heading
    id={sluggifyChildren(props.children)}
    mb="3"
    mt="6"
    size="xl"
    asChild
  >
    <h3 {...props} />
  </Heading>
);
export const H4 = (props: HeadingProps) => (
  <Heading
    id={sluggifyChildren(props.children)}
    mb="3"
    mt="6"
    size="lg"
    asChild
  >
    <h4 {...props} />
  </Heading>
);
export const H5 = (props: HeadingProps) => (
  <Heading
    id={sluggifyChildren(props.children)}
    mb="3"
    mt="6"
    size="lg"
    fontWeight="500"
    asChild
  >
    <h5 {...props} />
  </Heading>
);
export const H6 = (props: HeadingProps) => (
  <Heading
    id={sluggifyChildren(props.children)}
    mb="3"
    mt="6"
    size="lg"
    fontWeight="400"
    asChild
  >
    <h6 {...props} />
  </Heading>
);
