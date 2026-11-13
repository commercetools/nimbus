import { Table, Box, Flex, Grid } from "@commercetools/nimbus";
import { ColorPalettes } from "@/components/document-renderer/components/token-demos/color-palettes.tsx";
import { ColorSteps } from "@/components/document-renderer/components/token-demos/color-steps.tsx";
import { IconSearch } from "./token-demos/icon-search";
import { SpacingScale } from "./token-demos/spacing-token-demo";
import { SizesScale } from "./token-demos/sizes-token-demo";
import { RadiiScale } from "./token-demos/radii-token-demo";
import { BordersScale } from "./token-demos/borders-token-demo";
import { ShadowsScale } from "./token-demos/shadows-token-demo";
import { BlursScale } from "./token-demos/blurs-token-demo";
import { CursorsScale } from "./token-demos/cursors-token-demo";
import { ZIndexScale } from "./token-demos/z-index-token-demo";
import { AspectRatiosScale } from "./token-demos/aspect-ratios-token-demo";
import { BreakpointsScale } from "./token-demos/breakpoints-token-demo";
import {
  AnimationsScale,
  MotionPlayground,
} from "./token-demos/animations-token-demo";
import { TypographyScale } from "./token-demos/typography-token-demo";
import * as icons from "@commercetools/nimbus-icons";
import { CategoryOverview } from "./category-overview/category-overview";
import { MDXComponents } from "mdx/types";
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
import { FoundationSections } from "./foundation-sections";
import { PropsTable } from "./props-table";
import { CodeTabs } from "./code-tabs";

/** The narrowest width of a Markdown table cell, below the `md` breakpoint. */
const MD_CELL_MIN_WIDTH = { base: "8rem", md: "0" };

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
      <Table.ScrollArea
        border="solid-25"
        borderColor="neutral.6"
        maxW="100%"
        mb="400"
      >
        <Table.Root variant="outline" {...props} />
      </Table.ScrollArea>
    );
  },
  thead: Table.Header,
  // On a narrow screen, a table with three or more columns scrolls sideways
  // instead of putting one or two words on each line.
  th: (props) => <Table.ColumnHeader minW={MD_CELL_MIN_WIDTH} {...props} />,
  tbody: Table.Body,
  td: (props) => (
    <Table.Cell whiteSpace="normal" minW={MD_CELL_MIN_WIDTH} {...props} />
  ),
  tr: Table.Row,
  /** layout components */
  Box: (props) => <Box {...props} />,
  Flex: (props) => <Flex {...props} />,
  Grid: (props) => <Grid {...props} />,
  /** custom elements */
  PropsTable: PropsTable,
  ColorPalettes: ColorPalettes,
  ColorSteps: ColorSteps,
  IconSearch,
  SpacingScale,
  SizesScale,
  RadiiScale,
  BordersScale,
  ShadowsScale,
  BlursScale,
  CursorsScale,
  ZIndexScale,
  AspectRatiosScale,
  BreakpointsScale,
  AnimationsScale,
  MotionPlayground,
  TypographyScale,
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
  FoundationSections,
  NimbusExportsList,
  CodeTabs,
};
