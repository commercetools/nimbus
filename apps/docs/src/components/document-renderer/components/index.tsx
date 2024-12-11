import { Text, Heading, Em, Link, Table, Box } from "@bleh-ui/react";

import { BlockquoteRenderer } from "./blockquotes.tsx";
import { ListItem, OlList, UlList } from "./lists.tsx";
import { CodeRenderer } from "./code.tsx";
import { Paragraph } from "./paragraph.tsx";
import { PropTable } from "@/components/prop-table/prop-table.tsx";
import { PropTables } from "@/components/prop-table/prop-tables.tsx";
import { Image } from "./image.tsx";
import { sluggify } from "@/utils/sluggify";
import { ColorScales } from "@/components/document-renderer/components/token-demos/color-scales.tsx";
import { IconSearch } from "./token-demos/icon-search";
import { SpacingTokenDemo } from "./token-demos/spacing-token-demo";
import { SizesTokenDemo } from "./token-demos/sizes-token-demo";
import { GenericTokenTableDemo } from "./token-demos/generic-token-table-demo";
import * as icons from "@bleh-ui/icons";
import { ReactNode } from "react";

const sluggifyChildren = (children: ReactNode) => {
  return sluggify(children ? children.toString() : "");
};

export const components = {
  h1: (props) => (
    <Heading id={sluggifyChildren(props.children)} mb="6" size="3xl" asChild>
      <h1 {...props} />
    </Heading>
  ),
  h2: (props) => (
    <Heading
      id={sluggifyChildren(props.children)}
      mb="3"
      mt="6"
      size="2xl"
      asChild
    >
      <h2 {...props} />
    </Heading>
  ),
  h3: (props) => (
    <Heading
      id={sluggifyChildren(props.children)}
      mb="3"
      mt="6"
      size="xl"
      asChild
    >
      <h3 {...props} />
    </Heading>
  ),
  h4: (props) => (
    <Heading
      id={sluggifyChildren(props.children)}
      mb="3"
      mt="6"
      size="lg"
      asChild
    >
      <h4 {...props} />
    </Heading>
  ),
  h5: (props) => (
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
  ),
  h6: (props) => (
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
  ),
  p: Paragraph,
  em: (props) => (
    <Em asChild>
      <em {...props} />
    </Em>
  ),
  blockquote: BlockquoteRenderer,
  code: CodeRenderer,
  a: ({ children, ...rest }) => {
    const isExternal = rest.href?.startsWith("http");

    const props = isExternal
      ? {
          target: "_blank",
          rel: "noopener noreferrer",
        }
      : {};
    return (
      <Link alignItems="baseline" variant="underline" {...rest} {...props}>
        {isExternal && <icons.ExternalLink size="1em" />}
        {children}
      </Link>
    );
  },
  strong: (props) => (
    <Text fontWeight="bold" asChild>
      <strong {...props} />
    </Text>
  ),
  ul: UlList,
  ol: OlList,
  li: ListItem,
  img: Image,
  table: (props) => {
    return (
      <Table.ScrollArea borderWidth="1px" maxW="100%">
        <Table.Root variant="outline" {...props} />
      </Table.ScrollArea>
    );
  },
  thead: Table.Header,
  th: Table.ColumnHeader,
  tbody: Table.Body,
  td: Table.Cell,
  tr: Table.Row,
  PropTable: PropTable,
  PropTables: PropTables,
  ColorScales: ColorScales,
  IconSearch,
  SpacingTokenDemo,
  SizesTokenDemo,
  GenericTokenTableDemo,
  ...icons.icons,
};
