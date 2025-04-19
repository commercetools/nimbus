import { Table } from "@commercetools/nimbus";
import { PropTable } from "@/src/components/document-renderer/components/prop-table/prop-table.tsx";
import { PropTables } from "@/src/components/document-renderer/components/prop-table/prop-tables.tsx";
import { ColorScales } from "@/src/components/document-renderer/components/token-demos/color-scales.tsx";
import { IconSearch } from "./token-demos/icon-search";
import { SpacingTokenDemo } from "./token-demos/spacing-token-demo";
import { SizesTokenDemo } from "./token-demos/sizes-token-demo";
import { GenericTokenTableDemo } from "./token-demos/generic-token-table-demo";
import { TextStylesDemo } from "./token-demos/text-styles-demo";
import * as icons from "@commercetools/nimbus-icons";

import { MDXComponents } from "mdx/types";
import {
  EasingTokenDemo,
  DurationTokenDemo,
  KeyframeTokenDemo,
} from "./token-demos/animation";

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

export const components: MDXComponents = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  p: Paragraph,
  em: Em,
  blockquote: (props) => <Blockquote {...props} />,
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
  td: Table.Cell,
  tr: Table.Row,
  /** custom elements */
  PropTable: PropTable,
  PropTables: PropTables,
  ColorScales: ColorScales,
  IconSearch,
  SpacingTokenDemo,
  SizesTokenDemo,
  GenericTokenTableDemo,
  EasingTokenDemo,
  DurationTokenDemo,
  KeyframeTokenDemo,
  TextStylesDemo,
  /** all icons from @commercetools/nimbus-icons, TODO: evaluate if this is a good idea */
  Icons: icons,
};
