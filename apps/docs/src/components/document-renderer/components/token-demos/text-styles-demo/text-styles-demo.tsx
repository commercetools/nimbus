import {
  Code,
  system,
  TableBody,
  TableCell,
  TableColumnHeader,
  TableHeader,
  TableRoot,
  TableRow,
  Text,
} from "@bleh-ui/react";
export const TextStylesDemo = () => {
  const obj = system._config.theme?.textStyles || [];
  const items = Object.entries(obj).map(([name, value]) => ({ name, value }));

  return (
    <div>
      <TableRoot>
        <TableHeader>
          <TableRow>
            <TableColumnHeader width="16ch">Token-Name</TableColumnHeader>
            <TableColumnHeader>Demo</TableColumnHeader>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items &&
            items.map((item) => {
              const { name } = item;

              return (
                <TableRow key={name}>
                  <TableCell>
                    <Code variant="subtle">{name}</Code>
                  </TableCell>
                  <TableCell>
                    <Text textStyle={name}>Demo Text</Text>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </TableRoot>
    </div>
  );
};
