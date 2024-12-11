import { themeSizeTokensAtom } from "@/atoms/theme-size-tokens.ts";
import {
  Box,
  Text,
  TableRoot,
  TableBody,
  TableColumnHeader,
  TableCell,
  TableHeader,
  TableRow,
  Flex,
  TableColumnGroup,
  TableColumn,
} from "@bleh-ui/react";
import { useAtomValue } from "jotai";
import orderBy from "lodash/orderBy";

const sorter = {
  regular: (obj) => parseFloat(obj.value.originalValue),
  fraction: (obj) => [
    (fraction: string) => parseInt(fraction.split("/")[1]),
    (fraction: string) => eval(fraction),
  ],
  other: (obj) => obj.label,
};

export const SizesTokenDemo = ({ group }: { group: string }) => {
  const sizeTokens = useAtomValue(themeSizeTokensAtom);

  if (!sizeTokens) return null;
  const subset = orderBy(
    sizeTokens.filter((item) => item.group === group),
    sorter[group || "other"]
  );
  return (
    <Box mb="12" mt="6">
      <TableRoot width="full" maxWidth="full">
        <TableColumnGroup>
          <TableColumn width="18ch" />
          <TableColumn width="18ch" />
          <TableColumn maxWidth="16" />
        </TableColumnGroup>
        <TableHeader>
          <TableRow>
            <TableColumnHeader>Token</TableColumnHeader>
            <TableColumnHeader>Value</TableColumnHeader>
            <TableColumnHeader>Demo</TableColumnHeader>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subset.map((item) => (
            <TableRow key={item.id} id={item.id}>
              <TableCell>
                <Text fontFamily="mono">{item.label}</Text>
              </TableCell>
              <TableCell>{item.value.originalValue}</TableCell>
              <TableCell>
                <Box position="relative">
                  <Flex minHeight="1em" overflow="hidden">
                    <Box
                      width="100%"
                      maxWidth={item.value.originalValue}
                      height="4"
                      bg="primary.9"
                    />

                    <Box flexGrow="1" height="4" bg="primary.3" />
                  </Flex>
                  <Flex
                    position="absolute"
                    right="0"
                    top="0"
                    height="4"
                    bgImage="linear-gradient(to right, transparent, {colors.primary.3})"
                    width="6"
                  />
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableRoot>
    </Box>
  );
};
