import { preferPxAtom } from "@/atoms/prefer-px-atom";
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
  Code,
} from "@bleh-ui/react";
import { useAtom, useAtomValue } from "jotai";
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
  const [showPx, setShowPx] = useAtom(preferPxAtom);
  const sizeTokens = useAtomValue(themeSizeTokensAtom);

  if (!sizeTokens) return null;
  const subset = orderBy(
    sizeTokens.filter((item) => item.group === group),
    sorter[group || "other"]
  );

  const formatterFn = (val: string) => {
    switch (true) {
      case val.includes("rem"):
        return showPx ? `${parseFloat(val) * 16}px` : `${val}`;
      case val.includes("px"):
        return !showPx ? `${parseFloat(val) / 16}rem` : `${val}`;
      default:
        return val;
    }
  };

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
                <Code variant="subtle">{item.label}</Code>
              </TableCell>
              <TableCell onClick={() => setShowPx(!showPx)} cursor="button">
                {formatterFn(item.value.originalValue)}
              </TableCell>
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
