import {
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
  /** displays a JSON-tree to debug */
  debug: boolean;
};

export const GenericTokenTableDemo = ({
  debug,
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => {
            return (
              <TableRow key={row.name}>
                <TableCell>
                  <Text fontWeight="600">{row.name}</Text>
                </TableCell>
                <TableCell>{row.value.value}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </TableRoot>
      {debug && <JSONTree data={system.tokens.categoryMap} />}
    </div>
  );
};
