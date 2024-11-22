import {
  Box,
  system,
  TableBody,
  TableCell,
  TableColumnHeader,
  TableHeader,
  TableRoot,
  TableRow,
  Text,
} from "@bleh-ui/react";
import { JSONTree } from "react-json-tree";
import { useMemo } from "react";

type GenericTableDemoProps = {
  /** the name of the token-category */
  category: string;
  /** demoProperty */
  demoProperty?: string;
  /** displays a JSON-tree to debug */
  debug?: boolean;
};

const PrettyBox = (props) => (
  <Box
    bg="neutral.1"
    border="xs"
    borderColor="neutral.7"
    color="neutral.11"
    fontWeight="semibold"
    aspectRatio="golden"
    maxWidth="40"
    p="4"
    {...props}
  />
);

export const GenericTokenTableDemo = ({
  debug,
  demoProperty,
  ...props
}: GenericTableDemoProps) => {
  const data = useMemo(() => {
    const data = system.tokens.categoryMap.get(props.category);

    return Array.from(data, ([name, value]) => ({
      name,
      value,
    }));
  }, [props.category]);

  if (!data) return null;

  return (
    <div>
      <TableRoot>
        <TableHeader>
          <TableRow>
            <TableColumnHeader>Name</TableColumnHeader>
            <TableColumnHeader>Value</TableColumnHeader>
            {demoProperty && <TableColumnHeader>Demo</TableColumnHeader>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => {
            return (
              <TableRow key={row.name}>
                <TableCell verticalAlign="top">
                  <Text fontWeight="600">{row.name}</Text>
                </TableCell>
                <TableCell verticalAlign="top">{row.value.value}</TableCell>
                {demoProperty && (
                  <TableCell verticalAlign="top">
                    <PrettyBox {...{ [demoProperty]: row.name }}>
                      {row.name}
                    </PrettyBox>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </TableRoot>
      {debug && <JSONTree data={system.tokens.categoryMap} />}
    </div>
  );
};
