import { Text, Heading, Em, Link, Table } from "@bleh-ui/react";

import { BlockquoteRenderer } from "./Blockquotes";
import { ListItem, OlList, UlList } from "./Lists";
import { CodeRenderer } from "./Code";
import { Paragraph } from "./Parapraph";
import { PropsTable } from "../../PropsTable/PropsTable";
import { PropTables } from "../../PropsTable/PropTables";
import { Image } from "./Image";
import { sluggify } from "../../../utils/sluggify";
import { ColorScales } from "../../ColorScales";
import { IconSearch } from "../../IconSearch";

export const components = {
  h1: (props) => (
    <Heading id={sluggify(props.children)} mb="6" size="3xl" asChild>
      <h1 {...props} />
    </Heading>
  ),
  h2: (props) => (
    <Heading id={sluggify(props.children)} mb="3" mt="6" size="2xl" asChild>
      <h2 {...props} />
    </Heading>
  ),
  h3: (props) => (
    <Heading id={sluggify(props.children)} mb="3" mt="6" size="xl" asChild>
      <h3 {...props} />
    </Heading>
  ),
  h4: (props) => (
    <Heading id={sluggify(props.children)} mb="3" mt="6" size="lg" asChild>
      <h4 {...props} />
    </Heading>
  ),
  h5: (props) => (
    <Heading
      id={sluggify(props.children)}
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
      id={sluggify(props.children)}
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
  a: (props) => <Link variant="underline" {...props} />,
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
  PropTable: PropsTable,
  PropTables: PropTables,
  ColorScales: ColorScales,
  IconSearch,
};
