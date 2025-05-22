import { Table, Box, Flex, Grid } from "@commercetools/nimbus";
import { ColorScales } from "@/components/document-renderer/components/token-demos/color-scales.tsx";
import { IconSearch } from "./token-demos/icon-search";
import { SpacingTokenDemo } from "./token-demos/spacing-token-demo";
import { SizesTokenDemo } from "./token-demos/sizes-token-demo";
import { GenericTokenTableDemo } from "./token-demos/generic-token-table-demo";
import { TextStylesDemo } from "./token-demos/text-styles-demo";
import * as icons from "@commercetools/nimbus-icons";
import { CategoryOverview } from "./category-overview/category-overview";
import { MDXComponents } from "mdx/types";
import {
  EasingTokenDemo,
  DurationTokenDemo,
  KeyframeTokenDemo,
} from "./token-demos/animation";
import { NimbusExportsList } from "@/components/document-renderer/components/nimbus-exports-list";

import {
  ListItem,
  OlList,
  UlList,
  Paragraph,
  Code,
  Blockquote,
  Image,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Em,
  Link,
  Strong,
} from "./base-tags";
import { Frontpage } from "./frontpage";
import { PropsTable } from "./props-table";

export const components: MDXComponents = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  p: Paragraph,
  pre: (props) => <Box as="pre" mb="400" {...props} />,
  em: Em,
  blockquote: (props) => <Blockquote {...props} />,
  hr: (props) => <Box as="hr" my="600" {...props} />,
  code: Code,
  a: Link,
  strong: Strong,
  ul: UlList,
  ol: OlList,
  li: ListItem,
  img: Image,
  table: (props) => {
    return (
      <Table.ScrollArea border="solid-25" borderColor="neutral.6" maxW="100%">
        <Table.Root variant="outline" {...props} />
      </Table.ScrollArea>
    );
  },
  thead: Table.Header,
  th: Table.ColumnHeader,
  tbody: Table.Body,
  td: (props) => <Table.Cell whiteSpace="normal" {...props} />,
  tr: Table.Row,
  /** layout components */
  Box: (props) => <Box {...props} />,
  Flex: (props) => <Flex {...props} />,
  Grid: (props) => <Grid {...props} />,
  /** custom elements */
  PropsTable: PropsTable,
  ColorScales: ColorScales,
  IconSearch,
  SpacingTokenDemo,
  SizesTokenDemo,
  GenericTokenTableDemo,
  EasingTokenDemo,
  DurationTokenDemo,
  KeyframeTokenDemo,
  TextStylesDemo,
  Icon: ({ id, ...props }) => {
    const Component = icons[id as keyof typeof icons];
    return (
      <Box as="span" display="inline-block" {...props}>
        <Component height="100%" width="100%" />
      </Box>
    );
  },
  /** all icons from @commercetools/nimbus-icons */
  Icons: icons,
  Frontpage,
  CategoryOverview,
  NimbusExportsList,
};
